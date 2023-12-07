import {
    handleMessage,
    fetchVideoChatData,
    loadMessagesHandler,
    handleLookMessage,
} from "./controllers/socket/messageController.js";
import {
    addDMHandler,
    getDMsHandler,
} from "./controllers/socket/userController.js";

import User from "./models/userModels.js";

global.onlineUsers = new Map();
global.onlineSupports = new Map();

const socketConnectionManager = function (socket, io) {
    socket.on("add-user", async (userId) => {

        console.log("add-user");
        const userData = await User.findById(userId);

        // for (var entry of onlineSupports.entries()) {
        //     var key = entry[0], value = entry[1];
        //     console.log(key, value);
        // }

        let userSocket = onlineSupports.get(userId);
        if(userSocket) {
            console.log("logout automatically");
            socket.to(userSocket).emit("logout", {});
        }

        if(userData){
            if(userData.role != "0" && userData.role != 0 ) {
                onlineSupports.set(userId, socket.id);
                
                // console.log("added on support");
                // console.log("---- current supports ----");
                // for (var entry of onlineSupports.entries()) {
                //     var key = entry[0], value = entry[1];
                //     console.log(key, value);
                // }
                // console.log("----------------");

                
            } else {
                onlineUsers.set(userId, socket.id);
                console.log("added on normal user");
            }
        }
    });
    socket.on("message:send", handleMessage);
    socket.on("message:looked", handleLookMessage);
    socket.on("messages:read", loadMessagesHandler);
    socket.on("DMs:create", addDMHandler);
    socket.on('disconnect', () => {
        console.log("user disconnected ");
    });
};

export default socketConnectionManager;
