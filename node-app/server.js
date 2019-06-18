const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const passport = require('passport')

const app = express()

// 引入users.js 登录/注册
const users = require('./routers/api/users')
// 引入profiles.js
const profiles = require('./routers/api/profiles')


// 使用body-parse中间件
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())


// 连接数据库
// mongod --dbpath=E:\Demo\node-vue3-elemui\node-app\db --port=27017
mongoose.connect('mongodb://localhost:27017/nodeapp',{useNewUrlParser:true},function(err){
    if(err){
        console.log('数据库连接失败')
    } else {
        console.log('数据库连接成功')
    }
})

// passport 初始化
app.use(passport.initialize());
// 代码分离
require('./config/passport')(passport)


app.get('/',(req,res)=>{
    res.send("ddd2222ddd")
})
//使用路由
app.use('/api/users',users)
app.use('/api/profiles',profiles)

const port = process.env.PORT || 5000;
// 监听服务器端口
app.listen(port,() =>{
    console.log(`服务器已启动，Server running on port ${port}`)
})