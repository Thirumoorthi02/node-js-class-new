import { Application, NextFunction, Request, Response, Router } from "express";
import { ClientRequest, ServerResponse } from "http";
import * as http from "http";
import * as fs from "fs";
// const http = require("http");
// const fs = require("fs");
const express = require("express");

const app: Application = express();
const router: Router = express.Router();
const port = process.env.PORT || 3000;


http
  .createServer((req: any, res: ServerResponse) => {
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

router.get("/123", (req: Request, res: Response, next: NextFunction) => {
  next();
  console.log(1234);
});

router.get("/123", (req: Request, res: Response, next: NextFunction) => {
  next();
  console.log("1234abc");
});

// Setup static directory to serve
app.use(router);

app.get("/123", (req: Request, res: Response) => {
  console.log(4568);
  res.send("<h1>Hey there!</h1>");
});

app.listen(port, () => {
  console.log("Server is up on port " + port);
});
