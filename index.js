import express from "express";
import {dirname} from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import { default as mongodb } from 'mongodb';

let MongoClient = mongodb.MongoClient;


var username = "";
var password = "";
var type = "";
var variant = "";

const client = new MongoClient("mongodb://localhost:27017");
const _dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;
const db = client.db("AgroFuture");
const users = db.collection("UserInfo");
const seedData = db.collection("seedData");

var cursor_seed = await seedData.findOne({
    "type" : "Not Selected"
});

var cursor = await users.findOne({"username" : "None"});

async function setNot(){
    cursor_seed = await seedData.findOne({
        "type" : "Not Selected"
    });
}

async function getLoginInfo(){
    try{
        if(await users.findOne({
            "username": username
        })){
            cursor = await users.findOne({
                "username": username
            });
        }
        console.log(cursor.password);
        if(cursor.password == password){
            return true;
        }
        else{
            false;
        }
    }
    catch(ex){
        console.log("ERROR");
    }
}

async function getVariant(){
    try{
        cursor_seed = await seedData.findOne({
            type: type,
            name: variant
        });
    }
    catch(ex){
        console.log("ERROR");
    }
}


app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));



//sign-up



// Login


app.get("/", (req,res)=> {
    res.render("login.ejs", {});
});

app.get("/login-pass", (req,res)=> {
    res.send({"password": cursor.password});
});

app.post("/login", (req,res) => {
    username = req.body.username;
    password = req.body.password;
    if(getLoginInfo()){
        console.log("YESSS");
        //res.send('<script>window.location.href="https://localhost:3000/home";</script>');
    }
    else{
        console.log("NOOO");
    }
});


//seedData

app.get("/seedLoad", (req,res)=> {
    res.send({"password": password});
});


app.post("/seedVar", (req,res) => {
    type = req.body.type;
    variant = req.body.name;
    getVariant();
    if(cursor_seed.name != "Not Selected"){
        console.log("YESSS");
        console.log(cursor_seed.name);
        //res.send('<script>window.location.href="https://localhost:3000/home";</script>');
    }
    else{
        console.log("NOOO");
    }
});

app.get("/home", (req,res)=> {
    res.render("homepage.ejs", {});
});

app.get("/seedBuffer", (req,res)=> {
    res.render("seedBuffer.ejs", {});
    setNot();
});

app.get("/weather", (req,res)=> {
    res.sendFile(_dirname + "/index2.html");
});

app.get("/seedData", (req,res) => {
    res.render("seedShowcase_Maize.ejs", {
        type : cursor_seed.type,
        name : cursor_seed.name,
        creationLocation : cursor_seed.creationLocation,
        location : cursor_seed.location,
        water : cursor_seed.water,
        immunities : cursor_seed.immunities,
        Yield : cursor_seed.Yield,
        Nutrients : cursor_seed.Nutrients,
        disease : cursor_seed.disease,
        pesticide : "to remove",
        harvest : cursor_seed.harvest,
        description : cursor_seed.description
    });
});

app.get("/signup", (req,res)=> {
    res.render("sign.ejs", {});
});

app.get("/about", (req,res)=> {
    res.render("about.ejs", {});
});

app.listen(port, (req,res) => {
    console.log("Listening on Port 3000.");
});