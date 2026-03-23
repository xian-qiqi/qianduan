// import moduleA from "./module/moduleA.js"  //完整的名字
// console.log(moduleA.getName())


import {moduleB} from "./module/moduleA.js" 
console.log(moduleB.getName())

//不允许 require（commonjs）和import（ES6模块化写法----在package.json里面添加 "type": "module",）混用

