import mongoose, { Mongoose, mongo } from "mongoose";
import Message from "../../models/messageModels.js";
import User from "../../models/userModels.js";

export const handleMessage = async function (payload, callback) {
    const socket = this;
    // const {
    //     from,
    //     message,
    //     type,
    //     to,
    //     replyTo,
    //     caption,
    //     senderSocketId,
    //     date,
    //     senderName,
    // } = payload;
    // console.log(replyTo);
    let newHistory;
    let newUserData = null;
    let newMessage = {
        from: payload.from,
        to: payload.to,
        caption: payload.caption,
        replyTo: payload.replyTo,
        message: payload.message,
        type: payload.type,
        senderName: payload.senderName,
        date: payload.date
    };
    let newMessageId;
    try {
        const user = await User.findById(payload.from);
        if (user.status != "active") {
            return callback({ error: "User blocked!" });
        }

        const userData = await Message.findOne({ user: payload.to });
        if (userData) {
            let length = userData.messageList.push(newMessage);
            // console.log(payload.from, payload.to);
            userData.isnew = payload.from == payload.to ? true : false;
            // if (userData.isnew) {
            Message.find({ order: { $lt: userData.order } })
                .then((messages) => messages.forEach((val) => {
                    val.order = val.order + 1;
                    val.save();
                }));
            userData.order = 0;
            console.log("order change", userData);
            // }
            await userData.save();
            newMessageId = userData.messageList[length - 1]._id;
        } else {
            if (payload.from == payload.to)
                Message.find({}).then((messages) => messages.forEach((val) => {
                    console.log("order here", val);
                    val.order = val.order + 1;
                    val.save();
                }));
            let messageList = [newMessage];
            newHistory = await Message.create({
                user: payload.to,
                messageList,
                isnew: payload.from == payload.to ? true : false,
                order: 0
            });
            newUserData = await User.findById(payload.to).select('-password -role -verify');
            console.log("----------New User Data------------");
            console.log(newUserData);
            await newHistory.save();
            newMessageId = newHistory.messageList[0]._id;
        }
        // if(!userData || userData.isnew) {
        //     Message.find({order:{$gte:{}}});
        // }

    } catch (error) {
        console.info(error);
        return callback({ error: "Database error!" });
    }

    callback({ id: newMessageId });

    let receivers = [];

    let userSocket = onlineUsers.get(payload.to);
    if (userSocket) {
        receivers.push(userSocket);
    }

    for (var entry of onlineSupports.entries()) {
        var key = entry[0], value = entry[1];
        receivers.push(value);
    }

    if (receivers.length > 0) {
        for (let item of receivers) {
            socket.to(item).emit("message:created", {
                ...newMessage,
                _id: newMessageId,
                // roomId: payload.roomId,
                newUser: newUserData,
            });
        }
    }

    return;
};

export const handleLookMessage = async function (payload, callback) {
    const socket = this;
    const {
        roomId
    } = payload;

    const userData = await Message.findOne({ user: roomId });

    if (userData) {
        await Message.updateOne({ user: roomId }, { isnew: false });

        callback({
            data: {
                roomId: roomId,
            }
        });

        let receivers = [];

        for (var entry of onlineSupports.entries()) {
            var key = entry[0], value = entry[1];
            receivers.push(value);
        }

        if (receivers.length > 0) {
            for (let item of receivers) {
                console.log("Look: send to receiver " + item);
                socket.to(item).emit("message:looked", {
                    roomId
                });
            }
        }
    }
}

export const fetchVideoChatData = async function (videochatId, callback) {
    const socket = this;
    try {
        const message = await Message.findById(videochatId).populate(
            "sender",
            "name email avatar"
        );

        const participants = [];

        for (let id of message.participants) {
            const user = await User.findById(id).select("name email avatar");
            participants.push(user);
        }

        callback({ videochat: message, participants });
    } catch (error) {
        console.log(error);
        return callback({ error: "Database error!" });
    }
};

export const loadMessagesHandler = async function (props, callback) {
    try {
        const { chatId, userId } = props;

        // console.log("read message = ", chatId, userId);

        const user = await User.findById(userId);

        let newChatId = chatId;
        let newUserId = userId;

        if (user.permission == "Support") {
            newUserId = process.env.SUPPORT_ID;
        } else {
            newChatId = process.env.SUPPORT_ID;
        }

        const messages = await Message.find({
            participants: { $all: [newChatId, newUserId] },
        }).populate("sender", "name");

        // console.log(messages);

        const constructedMessages = messages.map((message) => {

            return {
                senderName: message.sender.name,
                message: message.message,
                party:
                    newUserId === message.sender._id.toString()
                        ? "sender"
                        : "receiver",
                type: message.type,
                date: message.date,
            };
        });

        callback({ constructedMessages });
    } catch (error) {
        console.log(`ERROR ON RETRIEVING MESSAGES`);
        console.log(error);
        callback({ error: "Messages couldn`t be retrieved" });
    }
};

