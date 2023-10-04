const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://WorldVisaTravel_Repo:MB8OVectkcgduxeC@cluster0.u6xinii.mongodb.net/worldvisa?retryWrites=true&w=majority"
  )
  .then((res) => {
    console.log("connected successfully");
  })
  .catch((err) => {
    console.log(err);
  });
