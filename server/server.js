const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');
require('dotenv').config();

const app = express();
connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/bids', require('./routes/bidRoutes'));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Socket.io setup for real-time bidding
const io = require('socket.io')(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('join_auction', (auctionId) => {
        socket.join(auctionId);
    });

    socket.on('place_bid', (data) => {
        io.to(data.auctionId).emit('new_bid', data);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
}); 