import express, { Application } from "express";
import { router } from "./routes";
require("./db/mongoose"); // require of will execute the file provided in the path. here it will execure mongoose.ts

declare global {
  namespace Express {
    interface Request {
      [key: string]: any;
    }
  }
}

const app: Application = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(router);

app.listen(port, () => {
  console.log("Server is up on port ", port);
});
