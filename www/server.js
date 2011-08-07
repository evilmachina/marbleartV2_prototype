var http = require('http'),
    url = require('url'),
	fs = require('fs'),
	path = require('path'),
	sys = require('sys'),
	sio = require('socket.io'),
	net = require('net');

var port = 80,
    tcpPort = 51337;

Array.prototype.remove = function(e) {
	  for (var i = 0; i < this.length; i++) {
	    if (e == this[i]) { return this.splice(i, 1); }
	  }
	};

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
var curentPossision = 0,
	stepAngle = 1.8;

io.sockets.on("connection", function(socket){
	socket.emit("newPos", {pos: curentPossision});
	socket.on("move", function(mes){
		curentPossision = curentPossision > 359.9 ? 0 : curentPossision + stepAngle;	
		io.sockets.emit("newPos", {pos: curentPossision});
		sendToTcp(curentPossision);
		
	});
});

function sendToTcp(data){
	var length = tcpSockets.length - 1;
	for (var i = length; i >= 0; i--){
		try {
				tcpSockets[i].write(data.toString() + '\n');	
			}
		catch (err) {
				testTcpSocket(tcpSockets[i]);
			  	console.log('socket error: ' + err);
			}
	}
};

function testTcpSocket(socket)
{
	tcpSockets.remove(socket);	
};

process.on('uncaughtException', function(err){
	console.log('Something bad happend: ' + err);
	process.exit(0);
});

