var Todos = require("../models/todoModel.js");

module.exports = function (app) {
    app.get("/api/setupTodos", function (req, res) {
        var seedTodos = [
            {
                content: "Học Node.js !!",
                isDone: false
            },
            {
                content: "Học Vue.js !!",
                isDone: false
            },
            {
                content: "Làm ứng dụng hoàn chỉnh !!",
                isDone: false
            }
        ]

        Todos.create(seedTodos, function (err, results) {
            res.send(results);
        });
    });
}