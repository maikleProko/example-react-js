const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();
const http = require('http');
const socketIo = require("socket.io");


//Setting up parsers
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

//Main directory
app.use("/public", express.static(__dirname+"/public"));

//Setting up routes
const routes = require("./routes.js");
const Market = require('./market.js');

app.use('/', routes);

let server = http.createServer(app);
const io = socketIo(server);

let market = new Market(io);

io.on("connection", (socket) => {
    socket.on("startTrade", (distribution)=>{
        market.startTrade(distribution);
        io.emit("status", market.started);
    });

    socket.on("stopTrade", ()=>{
        market.endTrade();
        io.emit("status", market.started);

    });

    socket.on("buy", (buy)=>{
        market.handleBuy(buy);
    });

    socket.on("sell", (sell)=>{
        market.handleSell(sell);
    })

    socket.on("pull", (pull)=>{
        market.handlePull(pull);
    });
    socket.on("statusRequest", ()=>{
        socket.emit("status", market.started);
    })

});

server.listen(5000);
