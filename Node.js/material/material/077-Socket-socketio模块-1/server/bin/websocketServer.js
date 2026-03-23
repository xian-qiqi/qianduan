const JWT = require("../util/JWT")

//服务端
function start(server){
    const io = require('socket.io')(server);
    io.on('connection', (socket) => { 
        // console.log("连接", socket.handshake.query.token)  // !拿到token
        const playload = JWT.verify(socket.handshake.query.token)
        // console.log(playload)
        if(playload){
            socket.user = playload
            // console.log(socket.user)
            //发送欢迎
            // socket.emit("xian","欢迎进入聊天室")
            // socket.emit(WebSocketType.GroupChat.createMessage(socket.user),"欢迎来到聊天室")

            socket.emit(WebSocketType.GroupChat,createMessage(socket.user, "欢迎来到聊天室"))
            
            //给所有用户发送用户列表
        }else{
            socket.emit(WebSocketType.Error,createMessage(socket.user, "token过期"))
        }
    });
}

const WebSocketType = {
    Error:0, //错误
    GroupList:1,//获取列表
    GroupChat:2, //群聊
    SingleChat:3 //私聊
}

function createMessage(user, data){
    // return JSON.stringify({  // socketio支持传对象
    return { 
        user,
        data
    }
}
function sendAll(){
    

    
}

module.exports = start