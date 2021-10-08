const express = require('express');
const mysql = require('mysql2');
const ejs = require("ejs");
require('dotenv').config();


///////////////////////////////////////////////////////////////////////////
const db = mysql.createConnection({
    host: 'localhost',
    user:'root',
    password: 'Zekrom0@hell',
    database:'Online_Voting'
});

db.connect((e) => {
    if(e){
        throw e;
    }
    console.log("Connected");

});
///////////////////////////////////////////////////////////////////////////
const app = express();
app.set('view engine','ejs');
app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));  //instead of using bodyParser
app.use(express.json());
///////////////////////////////////////////////////////////////////////////
// app.route("/trial")
// .get((req,res) => {
//     db.query(
//         'SELECT* FROM `course`',
//         (e, result) => {
//             if(e) throw e;
//             res.sendFile(result);
//         }
//     );
// });

var loginfo;

app.route("/home")
.get((req,res) => {
    res.render("home");
});

///////////////////////////////////////////////////////////////////////////
app.route("/")

.get((req,res) =>{
    res.sendFile(__dirname+"/views/login.html");
})

.post((req,res) => {
    var ret = [];
    const id = req.body.username;
    const password = req.body.password;
    const sql = `Select user_id,user_password FROM user WHERE user_id = "${req.body.username}" AND user_password = "${req.body.password}"`
    db.query(sql,
    (e, result) => {
        if(e) throw e;
        // console.log(result);
        for(var i of result){
            ret.push(i);
        }
        loginfo = id;
        if(ret.length === 0){
            console.log("Username and Password do not match");
        } else {
            if(id.startsWith("A")){
                res.redirect("/admin");
                return;
            } else if (id.startsWith("C")){
                res.redirect("/candidate");
                return;
            }
            res.redirect("/home");
        }



        // console.log(req.body.username, req.body.password);
        //     console.log(parseInt(ret[0].id), ret[0].password);

        // if(req.body.username === ret[0].id.toString() && req.body.password === ret[0].password){

        //     res.redirect("/home");
        // }
    })
});
////////////////////////////////////////////////////////////////////////////
app.route("/register")

.get((req,res) =>{
    res.render("register");
})

.post((req,res) => {
    var ret = [];
    const id = req.body.username;
    const password = req.body.password;
    // const sql = `Select id,password FROM user WHERE id = ${req.body.username} AND password = "${req.body.password}"`
    const sql = `Insert into user (user_id, user_name, age, user_password, user_class, year) values("${req.body.id}", "${req.body.name}", ${req.body.age}, "${req.body.password}", "${req.body.class}", ${req.body.year})`
    db.query(sql,
    (e, result) => {
        if(e) throw e;
        // console.log(result);
        res.redirect("/home");
        // for(var i of result){
        //     ret.push(i);
        // }
        // if(ret.length === 0){
        //     console.log("Username and Password do not match");
        // } else {
        //     res.redirect("/home");
        // }
    })
});
/////////////////////////////////////////////////////////////////////////////
app.route("/admin")

.get((req,res) =>{
    res.render("admin");
})
/////////////////////////////////////////////////////////////////////////////
app.route("/createElection")

.get((req,res) =>{
    res.render("createElection");
})

.post((req,res) => {
    var ret = [];
    const id = req.body.username;
    const password = req.body.password;
    // const sql = `Select id,password FROM user WHERE id = ${req.body.username} AND password = "${req.body.password}"`
    const sql = `Insert into election (election_id, election_name, election_class, year)
                 values("${req.body.election_id}", "${req.body.election_name}","${req.body.election_class}", ${req.body.year})`
    db.query(sql,
    (e, result) => {
        if(e) throw e;
        // console.log(result);
        res.redirect("/admin");
        // for(var i of result){
        //     ret.push(i);
        // }
        // if(ret.length === 0){
        //     console.log("Username and Password do not match");
        // } else {
        //     res.redirect("/home");
        // }
    })
});
/////////////////////////////////////////////////////////////////////////////
const data = [];
app.route("/candidateApplication")

.get((req,res) =>{

    const sql = `Select * from user where user_id like "${loginfo}"`;
    db.query(sql,(e,result) => {
        if(e) throw e;
        for(var i of result){
            data.push(i);
        }
        res.render("candidateApplication",{election: data});
    })
  })
.post((req,res)=>{
  // const sql= ` UPDATE user SET user_id=concat('C',${loginfo}) `;
  const sql= ` Insert into candidates values("concat('C',user_id)", "${req.body.elename}","${req.body.eleid}")`
  db.query(sql,
  (e, result) => {
      if(e) throw e;
      res.redirect("/home");
  })
});
/////////////////////////////////////////////////////////////////////////////
// app.route("/showElection")
const ret = [];
const sql = `Select * from election`;
db.query(sql,(e,result) => {
    if(e) throw e;
    for(var i of result){
        ret.push(i);
    }
})

app.get("/showElection", (req,res) => {
    res.render("showElection",{election: ret});
})

app.get("/result",(req,res)=>{
  res.render("result");
})

/////////////////////////////////////////////////////////////////////////////
app.listen(3000, () => {
    console.log("Server started on port 3000");
});
