const express = require("express");
const app = express();

app.listen(2000, (error) => {
  if (error) {
    console.log(error);
  }
  console.log("Node is running");
});
