//var express = require('express'); 
//var app = express();
const http = require('http')
const port = 4000

/*log日志*/
let fs = require('fs');
let options = {
    flags: 'a',
    encoding: 'utf8',
};
let stdout = fs.createWriteStream('./stdout.log', options);
let stderr = fs.createWriteStream('./stderr.log', options);
let logger = new console.Console(stdout, stderr);


//app.use('/', express.static(__dirname + '/public')); 

const reqHandler = (req,res) =>{
    res.end()
}
//const server = http.createServer(app)
const server = http.createServer(reqHandler)
server.listen(port,function () {
  var host = server.address().address;
  var port = server.address().port;

  logger.log('start node.js server at http://%s:%s', host, port);
});

var redis = require('redis');
var redisclient = redis.createClient({
    retry_strategy: function (options) {
        if (options.error.code == 'ECONNREFUSED'){
            logger.error('redis: 连接被拒绝');
        }

        if(options.times_connected >10){
            logger.error('redis: 重试连接超过十次');
        }
        return Math.max(options.attempt *100,3000);
    }
});

var io = require('socket.io')(server);

var sub = function() {
    var a = a || 'a';
    redisclient.subscribe(a, function(e) {
        logger.log('subscribe channel : ' + a);
    });

    var b = b || 'b';
    redisclient.subscribe(b, function(e) {
        logger.log('subscribe channel : ' + b);
    });

    var c = c || 'c';
    redisclient.subscribe(c, function(e) {
        logger.log('subscribe channel : ' + c);
    });

    var d = d || 'd';
    redisclient.subscribe(d, function(e) {
        logger.log('subscribe channel : ' + d);
    });
}
sub();



io.on('connection', function(socket) {
    //logger.log('socket is connection');
    //var param_channel = socket.handshake.query.channel; 
    redisclient.on('message', function(channel, datas) {
            logger.log('accept channel: '+ channel);
            socket.emit(channel, datas);  
    });
    redisclient.on('error',function(err) {
        logger.error('redis on' + err);
    });
})