const fs=require("fs");
const http=require("http");

let registrationContent="";
let projectContent="";

fs.readFile("registration.html",(err,register)=>{
    if (err){
        throw err;
    }
    registrationContent=register;
})
fs.readFile("project.html",(err,project)=>{
    if (err){
        throw err;
    }
    projectContent=project;
})


http.createServer((req, res) => {
    let url = req.url;
    res.writeHead(200, { "Content-Type": "text/html" });

    switch (url) {
        case "/project":
            res.write(projectContent);
            res.end();
            break;
        default:
    
            res.write(registrationContent);
            res.end();
            break;
    }
}).listen(5000, () => {
    console.log("Server running on http://localhost:5000/");
});
