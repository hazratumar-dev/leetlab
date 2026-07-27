import { app } from "./app.js";
import dotenv from "dotenv";
import { connectDB } from "../src/db/db.js";

dotenv.config({
  path: ".env",
});

const port = process.env.PORT || 8000;

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is listenig on PORT: ${port}`);
    });
  })
  .catch((err) => {
    console.log("failed the databse connection");
  });
