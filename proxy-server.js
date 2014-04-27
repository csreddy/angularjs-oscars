var http = require('http'),
httpProxy = require('http-proxy');

var welcome = [
  '#    # ##### ##### #####        #####  #####   ####  #    # #   #',
  '#    #   #     #   #    #       #    # #    # #    #  #  #   # # ',  
  '######   #     #   #    # ##### #    # #    # #    #   ##     #  ',   
  '#    #   #     #   #####        #####  #####  #    #   ##     #  ',   
  '#    #   #     #   #            #      #   #  #    #  #  #    #  ',   
  '#    #   #     #   #            #      #    #  ####  #    #   #  '
].join('\n');

//
// Create your proxy server and set the target in the options.
//
var proxy = httpProxy.createProxyServer({});
//
// Create your target server
//
var server = require('http').createServer(function(req, res) {
  // You can define here your custom logic to handle the request
  // and then proxy the request.
	proxy.web(req, res, { target: 'http://localhost:8003' });
  
});

/*
function processRequest(req, res) {
    console.log(req.method + ": " + req.url + "=> I'm handling this.");

    res.writeHead(200, { "Content-Type": "text/plain" });
    res.write("Server responding to " + req.method + ": " + req.url + "\n");
    res.end();
} */

var port = 5050;
server.listen(port);
console.log(welcome);
console.log("listening on port " + port);


