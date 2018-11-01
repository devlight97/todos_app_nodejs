var mongoose = require("mongoose");
var Schema = mongoose.Schema; // khai báo ánh xạ

var todoSchema = new Schema({ // khai báo một model theo ánh xạ Schema
    content: String,
    isDone: Boolean
});

var Todos = mongoose.model("Todos", todoSchema); // tạo đối tượng model trong mongoDB

module.exports = Todos; // Tạo module để tạo đối tượng trong mongoDB
