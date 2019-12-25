var socketio = require('socket.io');
var async = require('async');
var _lodash = require('lodash');
var socketConnection = exports = module.exports = {};

socketConnection.listen = function listen(app) {
    io = socketio.listen(app);
    exports.sockets = io.sockets;
    global.socketIO = io.sockets;
    var loggedusers = [];
    console.log('socket connected');    
    io.sockets.on('connection', function (socket) {
        var eachuser;

        //socket.join(socket.id);
        //register logged in user id to the socket
        console.log('user connected');            
        
        socket.on('registersocket', function (data) {
            //eachuser = data.user_id; //data.user_type  //passing role as well //data.curr_time_offset
            //socket.join(data.user_id);
            //loggedusers[eachuser] = {};
            //loggedusers[eachuser].userId = data.user_id;
            //loggedusers[eachuser].userType = data.user_type;
            console.log('soket hit',data)
            // if(data.userType == 1){
            //     socket.join('admin');
            //     // socket.join("room-"+roomno);

            // }
            // else{
            //     socket.join('users');
            // }
            global.socketIO.emit("testevent",data);

            global.onlineUser = loggedusers;
        });
        

        socket.on('disconnect', function () {
            leaveLa();
        });

        var leaveLa = function () {
            
            global.onlineUser = loggedusers;
        };
        global.onlineUser = loggedusers;
        /*
        socketConnection.sendchatmessage = function sendchatmessage(data) {
            socket.to(data.user_id).emit('chatmessage', {data: data});
        };*/
        
    });
    return io;
};



module.exports.menuCreated = (menu) => {
    global.socketIO.emit('menuCreated', {menu : menu});
}

module.exports.menuUpdated = (menu) => {
    global.socketIO.emit('menuUpdated', { menu: menu});   
    // global.socketIO.emit('menuUpdated', { data: menu});
}



module.exports.orderConfirmed = (user) => {
    global.socketIO.emit('orderConfirmed', { user: user});   
}

module.exports.orderCancelled = (user) => {
    global.socketIO.in('admin').emit('orderCancelled', { user: user});   
}
module.exports.menuFreezed = (user) => {
    global.socketIO.emit('menuFreezed',{});   
}

module.exports.requestPayment = (user) => {
    global.socketIO.emit('paymentIntimation',{});   
}

module.exports.sendPaymentNotification = (data) => {
    global.socketIO.emit('sendPaymentNotification',data);   
}


