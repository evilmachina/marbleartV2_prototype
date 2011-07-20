var http = require('http'),
    url = require('url'),
	fs = require('fs'),
	path = require('path'),
	sys = require('sys'),
	sio = require('socket.io');

var port = 5000;

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

server.listen(port);

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
//	io.sockets.json.send({"pos": pos});
	socket.emit("newPos", {pos: curentPossision});
	socket.on("move", function(mes){
		curentPossision = curentPossision === 359 ? 0 : curentPossision + 1;	
		socket.emit("newPos", {pos: curentPossision});
	});
});

process.on('uncaughtException', function(err){
	console.log('Something bad happend: ' + err);
	process.exit(0);
});

