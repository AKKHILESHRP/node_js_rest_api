const fs = require("fs");
const http  = require("http");
const url = require("url");

http.createServer((req, res) => {
    const userData = fs.readFileSync("./data.json", "utf-8");
    const urlData = url.parse(req.url, true);

    // GET Request
    if(req.method === "GET" && urlData.pathname === "/users" && urlData.query.id === undefined) res.end(userData);
    else if(req.method === "GET" && urlData.pathname === "/users" && urlData.query.id !== undefined) {
        let usersData = JSON.parse(userData);
        let parsedUserData = usersData.find((data) => {
            return data.id == urlData.query.id;
        })
        if(parsedUserData != undefined) res.end(JSON.stringify(parsedUserData));
        else (res.end(JSON.stringify({ "message": "User not found!" })));
    }
    // POST Request
    else if(req.method === "POST" && urlData.pathname === "/users") {
        let postUsersData = "";
        req.on("data", (data) => {
            postUsersData += data;
        })
        req.on("end", () => {
            let endConnection = JSON.parse(userData);
            let data = JSON.parse(postUsersData);
            endConnection.push(data);
            fs.writeFile("./data.json", JSON.stringify(endConnection), (err) => {
                if(!err) res.end(JSON.stringify({ "message": "User Added successfully."}));
            })
        })
    }
    // PUT Request
    else if(req.method === "PUT" && urlData.pathname === "/users") {
        let updateData = "";
        req.on("data", (data) => {
            updateData += data;
        })
        req.on("end", () => {
            let data = JSON.parse(userData);
            let updateDataRecord = JSON.parse(updateData);
            let index = data.findIndex((update) => {
                return update.id == urlData.query.id;
            })
            data[index] = updateDataRecord;
            if(index != -1) {
                fs.writeFile("./data.json", JSON.stringify(data), (err) => {
                    if(!err) res.end(JSON.stringify({ "message": "User data updated successfully." }));
                })
            }
        })
    }
    // DELETE Request
    else if(req.method === "DELETE" && urlData.pathname === "/users") {
        let data = JSON.parse(userData);
        let index = data.findIndex((data) => {
            return data.id == urlData.query.id;
        })
        data.splice(index, 1);
        fs.writeFile("./data.json", JSON.stringify(data), (err) => {
            if(!err) res.end(JSON.stringify({ "message": "User Deleted successfully." }));
        })
    }
}).listen(8000);