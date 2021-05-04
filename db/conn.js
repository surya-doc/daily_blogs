const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/userslogin", {
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true
}).then(() => {
    console.log("Database successfull");
}).catch((e) => {
    console.log("No connection");
})