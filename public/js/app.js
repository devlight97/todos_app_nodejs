/*jslint devel: true*/
document.addEventListener("DOMContentLoaded",function()
{
    function refreshPage(results, isThis) {
        // if (isThis.tasks.length != 0) {
        //     isThis.tasks.splice(0,isThis.tasks.length);
        // }
        isThis.newTask = "";
        isThis.isIndex = undefined;
        isThis.nameButton = "Thêm";

        isThis.tasks = results;
    }

    // hàm đổi vị trí 2 task (chưa hoàn thiện)
    function swapTask ( isIndex, index) {
        let tempTask = {
            content: this.tasks[this.isIndex].content,
            isDone: this.tasks[this.isIndex].isDone
        }
        if ( index > this.isIndex ) {
            for ( let i = this.isIndex; i < index; i++ ) {
                this.tasks[i].content = this.tasks[i+1].content;
                this.tasks[i].isDone = this.tasks[i+1].isDone;
            }
            if ( this.location.begin > this.isIndex )
                this.location.begin = this.isIndex;
            if ( this.location.end < index )
                this.location.end = index;
        } else {
            for ( let i = this.isIndex; i > index; i-- ) {
                this.tasks[i].content = this.tasks[i-1].content;
                this.tasks[i].isDone = this.tasks[i-1].isDone;
            }
            if ( this.location.begin > index )
                this.location.begin = index;
            if ( this.location.end < this.isIndex )
                this.location.end = this.isIndex;
        }
        this.tasks[index].content = tempTask.content;
        this.tasks[index].isDone = tempTask.isDone;
        let listTasks = document.querySelectorAll("#task-manager li");
        listTasks[index].classList.add("el-picked");
        listTasks[this.isIndex].classList.remove("el-picked");
        this.isIndex = index;
    }

    $(document).keyup(function (e) {
        if ( e.keyCode === 38 ) appTaskManager.swapTaskByUp();
        if ( e.keyCode === 40 ) appTaskManager.swapTaskByDown();
        if ( e.keyCode === 13 && appTaskManager.nameButton === "Sửa" ) appTaskManager.handlingTask();
    });

    var appTaskManager = new Vue({
        el: '#task-manager',
        data: {
            location: {
                begin: 0,
                end: 0
            },
            nameButton: 'Thêm',
            checkState: '',
            newTask: '',
            tasks: [],
            isIndex: undefined,
            checkAsync: true
        },
        methods: {
            handlingTask: function () {
                if ( this.newTask != "" )
                {
                    // gọi ajax thêm task
                    if ( this.nameButton === "Thêm") {
                        $.ajax({
                            url: "http://localhost:8080/api/todo",
                            type: "POST",
                            dataType: "json",
                            data: {
                                content: this.newTask,
                                isDone: false
                            }
                        }).done(function (results) {
                            refreshPage(results,this);
                            this.checkState = "add-success";
                        }.bind(this));
                    }

                    // Gọi ajax sửa task
                    else if ( this.nameButton === "Sửa" ) {
                        $.ajax({
                            url: "http://localhost:8080/api/todo/",
                            type: "PUT",
                            dataType: "json",
                            data: {
                                begin: this.location.begin,
                                end: this.location.end,
                                tasks: this.tasks
                            }
                        }).done(function (results) {
                            refreshPage(results,this);
                            document.querySelector(".el-picked").classList.remove("el-picked");
                            this.checkState = "update-success";
                        }.bind(this));
                    }

                    

                }
                else
                {
                    if ( this.nameButton === "Thêm" ) {
                        this.checkState = "add-fail";
                    }

                    // gọi ajax xóa task
                    else if ( this.nameButton === "Xóa" ) {
                        $.ajax({
                            url: "http://localhost:8080/api/todo/" + this.tasks[this.isIndex]._id,
                            type: "DELETE",
                            dataType: "json",
                            data: {}
                        }).done(function (results) {
                            refreshPage(results,this);
                            document.querySelector(".el-picked").classList.remove("el-picked");
                            this.checkState = "delete-success";
                        }.bind(this))
                    }
                }

                
            },

            removeTask: function (task) {
                $.ajax({
                    url: "http://localhost:8080/api/todo/" + task._id,
                    type: "DELETE",
                    dataType: "json",
                    data: {}
                }).done(function (results) {
                    refreshPage(results,this);
                    this.checkState = "delete-success";
                    var listTask = document.querySelectorAll("#task-manager li");
                    for ( let i = 0; i < listTask.length; i++ ) {
                        listTask[i].classList.remove("el-picked");
                    }
                    this.isIndex = undefined;
                }.bind(this));
            },

            // dbclick
            pickTask: function (index) {
                if ( index === this.isIndex ) {
                    var listTask = document.querySelectorAll("#task-manager li");
                    listTask[index].classList.remove("el-picked");
                    this.newTask = "";
                    this.nameButton = "Thêm";
                    this.isIndex = undefined;
                    return;
                }
                else if ( this.isIndex != undefined ) return;
                this.checkState = "";
                var checkExists = document.querySelector(".el-picked");
                this.isIndex = index;
                var listTask = document.querySelectorAll("#task-manager li");
                listTask[index].classList.add("el-picked");
                this.nameButton = "Sửa";
                this.newTask = this.tasks[index].content;
            },

            swapTaskByMouse: function (index) {
                if ( this.nameButton === "Sửa" && index != this.isIndex) {
                    swapTask.call(this, this.isIndex, index);
                }

                
            },

            swapTaskByUp: function () {
                if ( this.isIndex > 0 && this.nameButton === "Sửa") {
                    swapTask.call(this, this.isIndex, this.isIndex-1);
                }
            },

            swapTaskByDown: function () {
                if ( this.isIndex < this.tasks.length - 1  && this.nameButton === "Sửa" ) {
                    swapTask.call(this, this.isIndex, this.isIndex+1);
                }
            },

            // sự kiện v-on:keyup=
            updateFromKeyBoard: function () {
                if ( this.newTask === "" && this.nameButton === "Sửa" ) {
                    this.checkState = "delete-ask";
                    this.nameButton = "Xóa";
                }
                else if ( this.newTask != "" && this.nameButton === "Xóa" ) {
                    this.checkState = "";
                    this.nameButton = "Sửa";
                }
                this.tasks[this.isIndex].content = this.newTask;
                if ( this.location.end < this.isIndex )
                    this.location.end = this.isIndex;
            }

        }
    });

    // lấy hết các todo hiện có
    $.ajax({
        url: "http://localhost:8080/api/todos",
        type: "GET",
        dataType: "json",
        data:{}
    }).done(function (results) {
        refreshPage(results,appTaskManager);
    });
},false);
