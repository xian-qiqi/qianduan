//webscoket 响应
const WebSocket = require('ws')
const WebSocketServer = WebSocket.WebSocketServer
const wss = new WebSocketServer({ port: 8080 });
const JWT = require("../util/JWT")

wss.on('connection', function connection(ws, req) {
    // console.log(req.url)
    const myURL = new URL(req.url, "httq://127.0.0.1:3000")
    // console.log(myURL)
    // console.log(myURL.searchParams)

    // 校验token
    const playload = JWT.verify(myURL.searchParams.get("token"))
    if (playload){
        ws.send(createMessage(WebSocketType.GroupChat, null, "欢迎来到聊天室"));

        // console.log(playload)
        ws.user = playload
        //群发
        sendAll()

    }else{
        ws.send(createMessage(WebSocketType.Error, null, "token过期"));
    }
    ws.on('message', function message(data) {
        // console.log('received: %s', data);
        //转发给其他人，
        // wss.clients.forEach(function each(client) {
        //     if (client !== ws && client.readyState === WebSocket.OPEN) {
        //         client.send(data,{binary:false}); // ?排除二进制binary
        //     }
        // });

        const msgObj = JSON.parse(data)
        switch(msgObj.type){
            case WebSocketType.GroupList:
                // console.log(Array.from(wss.clients).map(item=>item.user))
                // console.log(wss.clients)
                ws.send(createMessage(WebSocketType.GroupList, null, JSON.stringify(Array.from(wss.clients).map(item=>item.user))))
                break;
            case WebSocketType.GroupChat:
                console.log(msgObj.data)
                wss.clients.forEach(function each(client) {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(createMessage(WebSocketType.GroupChat, ws.user,msgObj.data), {binary:false});
                    }
                });

                break;
            case WebSocketType.SingleChat:
                wss.clients.forEach(function each(client) {
                    if (client.readyState === WebSocket.OPEN && client.user.username === msgObj.to) {
                        client.send(createMessage(WebSocketType.SingleChat, ws.user,msgObj.data), {binary:false});
                    }
                });
                break;
        }

    });

    ws.on("close", ()=>{
        // console.log(ws.user)
        //用户一离开
        wss.clients.delete(ws.user)
        sendAll()
        
    })
    
});

const WebSocketType = {
    Error:0, //错误
    GroupList:1,//获取列表
    GroupChat:2, //群聊
    SingleChat:3 //私聊
}

function createMessage(type, user, data){
    return JSON.stringify({
        type,
        user,
        data
    })
}
function sendAll(){
    //转发给其他人，
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(createMessage(WebSocketType.GroupList, null, JSON.stringify(Array.from(wss.clients).map(item=>item.user))))
        }
    });

    
}