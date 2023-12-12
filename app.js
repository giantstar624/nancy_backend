import express from "express";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import cors from "cors";
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import serveStatic from 'serve-static';
import fs from "fs";

import _ from 'lodash';
import socketConnectionManager from "./socket.js";
import { connectMongoDB } from "./db/connecton.js";

import dotenv from "dotenv";
dotenv.config();

// ----------------------------------------------
// mongo db for chat room
//port declaration................................

const PORT = process.env.PORT || 5000;
const base_url = process.env.BASE_URL

//database connection..............................
connectMongoDB();


//Importing the routes ............................
import usersRouter from './routes/usersRoutes.js';
import adminRouter from './routes/adminRoutes.js';
import postRouter from "./routes/postRoutes.js";
import authRouter from "./routes/authRoutes.js";
import reviewRouter from './routes/reviewRoutes.js';
import promoRouter from './routes/promoRoutes.js';
import chatRouter from './routes/chatRoutes.js';
import gameRouter from './routes/gameRoutes.js';
import fbRouter from './routes/fbRoutes.js';

//middleware function calling .....................
const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(cookieParser());

// file upload 
app.use(
  fileUpload({
    limits: {
      fileSize: 1000 * 1024 * 1024, // max file size is 10mb
    },
    abortOnLimit: true,
  })
);



const __dirname = path.resolve();
app.use(serveStatic(path.join(__dirname, 'public')));

// routes declarations ............................
app.use(`${base_url}auth`, authRouter);
app.use(`${base_url}promos`, promoRouter);
app.use(`${base_url}admin`, adminRouter);
app.use(`${base_url}post`, postRouter);
app.use(`${base_url}review`, reviewRouter);
app.use(`${base_url}chat`, chatRouter);
app.use(`${base_url}user`, usersRouter);
app.use(`${base_url}game`, gameRouter);
app.use(`${base_url}webhook`, fbRouter);

const privateKey = fs.readFileSync('./cert/117225.key');
const certificate = fs.readFileSync('./cert/117225.crt');

const credentials = {
  key: privateKey,
  cert: certificate,
  //   ca: ca
}

// HTTP SERVER
// const server = https.createServer(credentials, app);
const server = http.createServer(app);

// port function....................................
server.listen(PORT, () => {
  console.log(`app is listening on port ${PORT}`);

});

// SOCKET SERVER
const io = new Server(server);
// const io = new Server({
//   path: "/socket.io/"
// });
// io.listen(8443);

// console.log(io);

io.on("connection", function (socket) {
  console.log("connect request");
  socketConnectionManager(socket, io);
});


export default app;

