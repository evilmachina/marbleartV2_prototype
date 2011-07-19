var http = require('http'),
    url = require('url'),
	fs = require('fs'),
	path = require('path'),
	sys = require('sys'),
	sio = require('socket.io');

var port = 80;

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
var pos = 0;

io.sockets.on("connection", function(socket){
	io.sockets.json.send({"pos": pos});
	
	socket.on("move", function(mes){
		pos = pos === 359 ? 0 : pos + 1;
		console.log(pos);
		io.sockets.json.send({"pos": pos});
	});
});


