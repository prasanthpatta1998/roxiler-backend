const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const userRouter = require("./routers/transactionRuotes.jsx");
var cors = require("cors");

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());
app.use("/", userRouter);

mongoose
  .connect(
    "mongodb+srv://prasanthpatta:Prasanth1998@cluster0.pvxlyfo.mongodb.net/seedData?retryWrites=true&w=majority&appName=Cluster0",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("DB is connected!!!");
  });

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
