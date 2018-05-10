let client = [];
function CS() {
    var WebSocketServer = require('ws').Server, wss = new WebSocketServer({ port: 8181 });
    wss.on('connection', function (ws) {
        ws.on('message', function (message) {
            message = JSON.parse(message);
            if(message.type === 'init'){
                const nw = checkWS(message.userID)
                if(nw.length === 0) {
                    client.push({userID:message.userID, ws: ws})
                }
                ws.send(JSON.stringify({msg:'建立会话完成'}));
            } else {
                const nw = checkWS(message.Tid)
                nw[0].ws.send(JSON.stringify({msg:message.msg}));
            }
        });
    });
}

function checkWS(id) {
    return client.filter((um) => {
        if(um.userID === id){
            return um;
        }
    })
}

module.exports = CS;