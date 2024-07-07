import http from 'http'; // Importing http module properly
import express from 'express';
import cors from 'cors';
import logger from 'morgan';
import { Server } from 'socket.io';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv'; // Import dotenv for loading environment variables
import path from 'path';

dotenv.config(); // Load environment variables from .env file

// Routes
//import indexRouter  from './routes/index.js'
import conversationsRouter from './routes/conversations.js';
import userRouter from './routes/user.js';
import messageRouter from './routes/message.js';

const app = express();
app.use(cors({
    origin: '*',
}));
app.use(cookieParser());
const port = process.env.PORT || 4000 ;
app.set("port", port);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// Routes
//app.use('/', indexRouter);
app.use('/users', userRouter);
app.use('/conversations', conversationsRouter);
app.use('/messages', messageRouter);


// Middleware 404 handlers
app.use("*", (req, res) => {
    return res.status(404).json({
        success: false,
        message: "API endpoint doesn't exist"
    });
});
// Serve static files from the React app in production
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Websocket event handlers
const server = http.createServer(app);
const io = new Server(server);
io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
    socket.on('newMessage', (data) => { // Corrected event name
        console.log('New message', data)

        io.emit('newMessage', data)
    });

});

// Start server
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

