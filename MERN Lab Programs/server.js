const http=require('http');           //importing http
const server=http.createServer(       //creating an server
    function (req,res){
    res.writeHead(200,{'content-Type':'text/plain'});
    res.write("hello node.js web server is working");
    res.end();
}
);
server.listen(3000);
console.log("Server running at http://localhost:3000");