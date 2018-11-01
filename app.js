 var express = require("express");
 var bodyParser = require("body-parser");
 var morgan = require("morgan");
 var config = require("./config/index.js");
 var mongoose = require("mongoose");

 var app = express();
 var port = process.env.PORT || 8080; // lấy cổng global hoặc 3000

 var setupController = require("./api/controllers/setupController.js");
 var todoController = require("./api/controllers/todoController.js");

//  khai báo các middleware
app.use("/assets", express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev")); // sử dụng morgan để xuất ra console các request

app.set("view engine", "ejs"); // khai báo view engine

mongoose.connect(config.getLinkToConnectDB()); // lấy link kết nối tới mongoDB

// Gọi các controllers
setupController(app);
todoController(app);

app.get("/", function (req, res) {
    res.render("index.ejs");
});

app.listen(port, function () {
    console.log("Server is ready on port: " + port);
});