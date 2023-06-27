// SOCIAL MEDIA INDEX FILE
import server from "./src/routes/app.mjs";
import connectToDatabase from "./src/config/db.mjs";
import { PORT } from "./src/config/keys.mjs";
import logger from "./src/config/logger.mjs";

// CONNECT TO DATABASE.....
connectToDatabase();

const port = PORT || 4000;

// LISTEN TO.....
server.listen(port, () => {
  logger.info(`listening to port : ${port}`);
});
