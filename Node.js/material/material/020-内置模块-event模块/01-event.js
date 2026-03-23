/*
* events 模块是处理异步编程的核心模块之一。它通过发布-订阅模式来解决异步问题。

*/
const EventEmitter = require("events")

// 创建事件发射器实例
const event = new EventEmitter()

// 监听事件
event.on("play",(data)=>{
    console.log("事件触发了-play",data)
})

event.on("play",(data)=>{
    console.log("事件触发了-play",data)
})

event.on("play",(data)=>{
    console.log("事件触发了-play",data)
})
event.on("play",(data)=>{
    console.log("事件触发了-play",data)
})

event.on("run",(data)=>{
    console.log("事件触发了--run",data)
})
// 触发事件
setTimeout(()=>{
    event.emit("play","11111111")
},2000)