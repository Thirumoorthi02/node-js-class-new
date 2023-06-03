const http = require("http");
const fs = require("fs");
const express = require("express");

const app = express();
const router = express.Router();
const port = process.env.PORT || 3000;

http
  .createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write("\nHello World!");
    // res.writeContinue('\nHello World!');
    let i = 0;
    const x = setInterval(() => {
      console.log(i);
      res.write("<div>Hey there</div>");
      i++;
      if (i === 25) {
        clearInterval(x);
        res.end();
      }
    }, 1000);
  })
  .listen(8080, () => {
    console.log("Server started at port 8080");
  });

router.get("/123", (req, res, next) => {
  next();
  console.log(1234);
});

router.get("/123", (req, res, next) => {
  next();
  console.log("1234abc");
});

// Setup static directory to serve
app.use(router);

app.get("/123", (req, res) => {
  console.log(4568);
  res.send("<h1>Hey there</h1>");
});

app.listen(port, () => {
  console.log("Server is up on port " + port);
});
