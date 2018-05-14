var express = require('express');
var router = express.Router();
var userData = require('../userData.js');
const qs = require('qs');

/* GET users listing. */
router.get('/getUser', function(req, res, next) {
    const cookie = req.headers.cookie || '';
    const cookies = qs.parse(cookie.replace(/\s/g, ''), { delimiter: ';' });
    let response = {};
    let user = {};
    if (!cookies.token) {
        res.status(200).send({ message: 'Not Login' })
        return
    }
    const token = JSON.parse(cookies.token)
    if (token) {
        response.success = token.deadline > new Date().getTime()
    }
    if (response.success) {
        const userItem = userData.filter(_ => _.userID === token.userID)
        if (userItem.length > 0) {
            user.username = userItem[0].userName
            user.userID = userItem[0].userID
            userItem[0].type = 'online'
        }
    }
    response.user = user
    res.json(response)
});

router.post('/login', function(req, res, next) {
    const user = login(req.body);
    if(user.length != 0) {
        const now = new Date()
        now.setDate(now.getDate() + 1)
        res.cookie('token', JSON.stringify({ userID: user[0].userID, deadline: now.getTime() }), {
            maxAge: 1000 * 60 * 30,
            httpOnly: true,
        })
        res.json({
            userName: user[0].userName,
            userID: user[0].userID,
            name: user[0].name,
        })
        userData[userData.indexOf(user[0])].type = 'line';
    } else {
        res.status(403);
        res.json({errMsg: 'userName or password is error!'});
    }
});


function login(user) {
    return userData.filter( function (U) {
        if(U.userName === user.userName && U.password === user.password){
        return U;
      }
    })
}


router.get('/getonLineUser', function(req, res, next) {
    const online = userData.filter(_ => _.type === 'online');
    res.json(online)
});

module.exports = router;
