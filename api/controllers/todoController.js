var Todos = require("../models/todoModel.js");

function getTodos(res) {
    Todos.find(function (err, todos) {
        if (err) {
            throw err;
        } else {
            // console.log(todos);
            res.json(todos);
        }
    });
}

// Tạo RESTful API
module.exports = function (app) {

    // update hàng loạt
    app.put("/api/todo", function (req, res) {
        let begin = req.body.begin;
        let end = req.body.end;
        let tasks = req.body.tasks;
        console.log(begin);
        function updateTasks(n) {
            if ( n <= Number(end) ) {
                Todos.update(
                    { _id: tasks[n]._id },
                    {
                        content: tasks[n].content,
                        isDone: Boolean(tasks[n].isDone)
                    }, function (err, todo) {
                        if (err) res.status(500).json(err);
                        else updateTasks(n+1);
                    }
                );
            } else {
                getTodos(res);
            }
        }

        updateTasks(Number(begin));
    });

    // get all todos
    app.get("/api/todos", function (req, res) {
        getTodos(res);
    });

    // hàm findById lấy todo
    app.get("/api/todo/:id", function (req, res) {
        Todos.findById({ _id: req.params.id }, function (err, todo) {
            if (err) {
                throw err;
            } else {
                res.json(todo);
            }
        });
    });

    // thêm todo mới vào
    app.post("/api/todo", function (req, res) {
        var todo = {
            content: req.body.content,
            isDone: req.body.isDone
        };

        Todos.create(todo, function (err, todo) {
            if (err){ throw err; }
            else { getTodos(res); }
        });
    });

    // xóa todo
    app.delete("/api/todo/:id", function (req, res) {
        Todos.remove({ _id: req.params.id }, function (err, todo) {
            if (err) return res.status(500).json(err);
            else getTodos(res);
        });
    });
}