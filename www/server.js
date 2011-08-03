var http = require('http'),
    url = require('url'),
	fs = require('fs'),
	path = require('path'),
	sys = require('sys'),
	sio = require('socket.io'),
	net = require('net');

var port = 1337,
    tcpPort = 1338;



var server = http.createServer(function(req, res) {
       var uri = url.parse(req.url).pathname;
       
       var publicDir = path.join(process.cwd(), 'public');
       var filename = path.join(publicDir, uri);
       path.exists(filename, function(exists) {
               if (!exists) {
                       res.writeHead(404, {'Content-Type': 'text/plain'});
                       res.end('Not found...');
                       return;
               }

               fs.readFile(filename, "binary", function(err, file) {
                       if (err) {
                               res.writeHead(500, {'Content-Type': 'text/plain'});
                               res.end(err + '\n');
                               return;
                       }

                       res.writeHead(200);
                       res.end(file, "binary");
               });
       });
});

var tcpSockets = [];
server.listen(port);

var tcpServer = net.createServer(function (tcpSocket) {
  	tcpSockets.push(tcpSocket);
    tcpSocket.on('data', function(data){
	for (var i = 0; i < tcpSockets.length; i++){
	 tcpSockets[i].write(data);	
	}
	
  });
});

tcpServer.listen(tcpPort);

var io = sio.listen(server);
io.configure(function(){
/*
 io.set('transports', [
  'htmlfile'
 , 'xhr-polling'
 , 'jsonp-polling'
 ]);*/
});
var curentPossision = 0;

io.sockets.on("connection", function(socket){
   
	socket.emit("newPos", {pos: curentPossision});
	socket.on("move", function(mes){
		curentPossision = curentPossision === 359 ? 0 : curentPossision + 1;	
		io.sockets.emit("newPos", {pos: curentPossision});
		sendToTcp(curentPossision);
		
	});
});

function sendToTcp(data){
	for (var i = 0; i < tcpSockets.length; i++){
		try {
				tcpSockets[i].write(data.toString() + '\n');	
			}
		catch (err) {
			  	console.log('socket error: ' + err);
			}
	}
};

process.on('uncaughtException', function(err){
	console.log('Something bad happend: ' + err);
	process.exit(0);
});

