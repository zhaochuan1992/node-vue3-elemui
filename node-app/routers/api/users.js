const express = require("express")

const router = express.Router()
// 引入密码加密模块
const bcrypt = require('bcrypt')

const gravatar = require('gravatar')

const jwt = require('jsonwebtoken')

const passport = require('passport')

const User = require('../../models/User')

// router GET api/users/test

router.get('/test',(req,res)=>{

    res.json({msg:'lonin works'})

})

// router POST api/users/register
/**
 * 注册
 */
router.post('/register',(req,res)=>{
    // console.log(req.body)

    // 查询数据库中是否存在该邮箱
    User.findOne({email: req.body.email})
        .then((user)=>{
            if(user){
                 // 如果有，提示已被注册
                return res.status(400).json('邮箱已被注册！')
            } else {
                const avatar = gravatar.url(req.body.email, {s: '200', r: 'pg', d: 'mm'});
                // 如果没有，将数据增加到数据库中
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    avatar,
                    password: req.body.password,
                    identity: req.body.identity
                })

                // 对密码进行加密
                bcrypt.genSalt(10, function(err, salt) {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if(err) throw err

                        newUser.password = hash

                        newUser.save()
                            .then(user => res.json(user))
                            .catch(err => console.log(err))    
                                    
                    })
                })

            }
        })
})

// router POST api/users/login
// @desc  返回token jwt
// @access public
/**
 * 登录
 */
router.post('/login',(req,res)=>{
    const email = req.body.email
    const password = req.body.password
    // 查询数据库
    User.findOne({email})
        .then(user => {
            if(!user){
                return res.status(404).json('用户不存在！')
            }
            // 密码匹配
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if(isMatch){
                        // jwt.sign('规则','加密名字','过期时间','箭头函数')
                        const rule = {
                            id: user.id, 
                            name: user.name,
                            avatar: user.avatar,
                            identity: user.identity
                        }
                        jwt.sign(rule,'secret',{expiresIn:3600},(err,token) => {
                            if(err) throw err
                            res.json({
                                success: true,
                                token: 'Bearer ' + token
                            })
                        })
                        // res.json({msg:'success'})
                    } else {
                        return res.status(400).json('密码错误')
                    } 
                })
        })
})

// router GET api/users/current
// @desc  返回token jwt
// @access Private
router.get('/current',passport.authenticate('jwt',{session:false}),(req,res)=>{
    res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        identity: req.user.identity
    })
})

module.exports = router