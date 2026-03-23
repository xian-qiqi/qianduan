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

            // socket.emit(WebSocketType.GroupChat,createMessage(socket.user, "欢迎来到聊天室"))
            socket.emit(WebSocketType.GroupChat,createMessage(null, "欢迎来到聊天室"))
            //给所有用户发送用户列表
            sendAll(io)
        }else{
            socket.emit(WebSocketType.Error,createMessage(socket.user, "token过期"))
        }

        socket.on(WebSocketType.GroupList,(msg)=>{
            // console.log(io.sockets.sockets)
            // console.log(Array.from(io.sockets.sockets))
            // console.log(Array.from(io.sockets.sockets).map(item=>item[1].user))
            // socket.emit()    
            
            //在函数sendAll里面
        })
        socket.on(WebSocketType.GroupChat,(msg)=>{
            // console.log(msg)
            //给所有人发
            io.sockets.emit(WebSocketType.GroupChat, createMessage(socket.user, msg.data))
            //除了自己不发，只给其他人发
            // socket.broadcast.emit(WebSocketType.GroupChat, createMessage(socket.user, msg.data))  
        })
        socket.on(WebSocketType.SingleChat,(msg)=>{
            Array.from(io.sockets.sockets).forEach(item=>{
                if(item[1].user.username === msg.to){
                    item[1].emit(WebSocketType.SingleChat,
                        createMessage(socket.user, msg.data)
                    )
                }
            })
        })


        socket.on("disconnect", ()=>{
            sendAll(io)
    })
    });

    // io.on("disconnect", (socket)=>{
    //         sendAll(io)
    // })不行
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
function sendAll(io){ 
    //群发
    console.log(Array.from(io.sockets.sockets).map(item=>item[1].user))
    io.sockets.emit(WebSocketType.GroupList, createMessage(null, Array.from(io.sockets.sockets).map(item=>item[1].user).filter(item=>item)))
    //filter(item=>item)选出真信息（有用户信息）过滤假信息（undefine）
    
}

module.exports = start