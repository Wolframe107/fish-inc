const express = require('express');
const app = express();
const port = 3000;

var path = require('path')

app.use(express.static(__dirname, { // host the whole directory
    extensions: ["html", "htm", "gif", "png", "css","jpg", "js"],
}))

app.get('/', (req, res) => {        //get requests to the root ("/") will route here
    res.sendFile(path.resolve('public/index.html'));      //server responds by sending the index.html file to the client's browser
                                                        //the .sendFile method needs the absolute path to the file, see: https://expressjs.com/en/4x/api.html#res.sendFile 
});

app.listen(port, () => {            //server starts listening for any attempts from a client to connect at port: {port}
    console.log(`Now listening on port ${port}`);
    console.log(`http://localhost:${port}/`);
});
