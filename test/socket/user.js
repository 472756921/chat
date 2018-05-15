let client = [];
var userData = require('../userData.js');

function CS() {
    var WebSocketServer = require('ws').Server, wss = new WebSocketServer({ port: 8181 });
    wss.on('connection', function (ws) {
        ws.on('message', function (message) {
            message = JSON.parse(message);
            if(message.type === 'init'){
                const nw = checkWS(ws, message.userID);
                sendUpLine(message.userID);
            } else {
                const nw = checkWS(message.Tid);
                nw[0].ws.send(JSON.stringify({msg:message.msg, type:'chat'}));
            }
        });
        ws.on('close', function(wst) {
            try{
                const nw = checkWS(ws);
                client.splice(client.indexOf(nw[0]), 1);
            }catch(e){
                console.log(e);
            }
        });
    });
}

function checkWS(des, userID) {
    if(typeof des === Number){
        return client.filter((um) => um.userID === des );
    } else {
        if(userID === undefined) {
            return client.filter((um) => um.ws === des );
        } else {
            let wss = client.filter((um) => um.ws === des );
            if(wss.length === 0) {
                client.push({userID: userID, ws: des});
            }
        }
    }
}

function sendUpLine(userID) {
    const user = userData.filter(_ => _.userID === userID)[0];
    client.map((um) => {
        if(um.userID !== userID){
            try{
                um.ws.send(JSON.stringify({msg:{userName:user.userName, name: user.name, userID: user.userID}, type:'userUpLine'}));
            }catch(e){
                console.log(userID+'已经断开连接');
            }
        }
    })
}

module.exports = CS;