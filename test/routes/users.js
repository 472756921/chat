var express = require('express');
var router = express.Router();
var userData = require('../userData.js');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/login', function(req, res, next) {
    const user = login(req.body);
    if(user.length != 0) {
        let online = userData.filter(u => {
            if(u.type === 'line' && u.acc !== user[0].acc){
                return {acc: u.acc, name: u.name, userID: u.id};
            }
        })
        res.json({
            acc: user[0].acc,
            id: user[0].id,
            name: user[0].name,
            online: online,
        })
        userData[userData.indexOf(user[0])].type = 'line';
    } else {
        res.status(403);
        res.json({errMsg: 'acc or pwd is error!'});
    }
});


function login(user) {
    return userData.filter( function (U) {
        if(U.acc === user.acc && U.pwd === user.pwd){
        return true;
      }
    })
}

module.exports = router;
