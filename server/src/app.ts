import express, { Application } from "express";
//import routes from "./routes/routes";
import bodyParser from "body-parser";
import cors from "cors";
// Boot express
const app: Application = express();

app.use(cors());
// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Configuring json response
app.set("json spaces", 2);

//app.use("/api", routes);

export default app;
