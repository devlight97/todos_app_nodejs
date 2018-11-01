var userDB = require("./config"); // tự hiểu sẽ kết nối tới .json

module.exports = {
    getLinkToConnectDB: function () {
        return `mongodb://${ userDB.username }:${ userDB.password }@ds139219.mlab.com:39219/todos`
    }
}