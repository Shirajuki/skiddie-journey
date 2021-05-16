import app from "./app";
import config from "./config";

// REST API config
const port = config.PORT;

app.listen(port, () => {
  const host = config.HOST;
  console.log("[*] Server listening at http://%s:%s \n", host, port);
});
