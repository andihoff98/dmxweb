var websocket = require("websocket").server;
var http = require("http");
var nodeStatic = require("node-static");
var serialport = require("serialport");

var config = {};

function ws_handle(message){
  var data = JSON.parse(message.utf8Data);
  console.log(data);
  data.channel.forEach(function(chan){
    port.write(chan+","+data.value+"\n", "ascii");
  });
};


var port = new serialport("/dev/ttyACM0",{baudRate: 115200});
var static = new nodeStatic.Server("./web");

var httpServer = http.createServer(function(request, response){
  request.addListener("end", function() {
    static.serve(request, response);
  }).resume();
}).listen(8080);

var wsServer = new websocket({httpServer : httpServer});
wsServer.on("request", function(request) {
  console.log("ws connected");
  var conn = request.accept(null, request.origin);
  conn.on("message", ws_handle);
});
