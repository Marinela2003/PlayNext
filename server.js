const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

app.use(express.static(__dirname));

const db = new sqlite3.Database("./playnext.db", (err) => {

    if(err){

        console.log(err.message);

    }
    else{

        console.log("Connected to SQLite database.");

    }

});

/* USERS */

db.run(`

CREATE TABLE IF NOT EXISTS users(

id INTEGER PRIMARY KEY AUTOINCREMENT,

username TEXT UNIQUE,

email TEXT,

password TEXT,

role TEXT DEFAULT 'user'

)

`);

/* GAMES */

db.run(`

CREATE TABLE IF NOT EXISTS games(

id INTEGER PRIMARY KEY AUTOINCREMENT,

title TEXT,

genre TEXT,

releaseDate TEXT,

developer TEXT,

publisher TEXT,

description TEXT,

image TEXT

)

`);

/* RATINGS */

db.run(`

CREATE TABLE IF NOT EXISTS ratings(

id INTEGER PRIMARY KEY AUTOINCREMENT,

userId INTEGER,

gameId INTEGER,

rating INTEGER,

FOREIGN KEY(userId) REFERENCES users(id),

FOREIGN KEY(gameId) REFERENCES games(id)

)

`);

app.get("/", (req,res)=>{

    res.send("PlayNext Server Running!");

});

/* REGISTER */

app.post("/register", (req, res) => {

    const {

        username,
        email,
        password

    } = req.body;

    db.run(

        `INSERT INTO users
        (username,email,password)
        VALUES(?,?,?)`,

        [username, email, password],

        function(err){

            if(err){

                return res.status(400).json({

                    success:false,

                    message:"Username already exists"

                });

            }

            res.json({

                success:true,

                message:"Registration successful"

            });

        }

    );

});

/* =========================
   ADD GAME
========================= */

app.post("/games", (req, res) => {

    const {

        title,
        genre,
        releaseDate,
        developer,
        publisher,
        description,
        image

    } = req.body;

    db.run(

        `INSERT INTO games
        (title,genre,releaseDate,developer,publisher,description,image)
        VALUES(?,?,?,?,?,?,?)`,

        [

            title,
            genre,
            releaseDate,
            developer,
            publisher,
            description,
            image

        ],

        function(err){

            if(err){

                return res.status(500).json({

                    success:false,

                    message:"Unable to add game."

                });

            }

            res.json({

                success:true,

                message:"Game added successfully."

            });

        }

    );

});

/* =========================
   GET ALL GAMES
========================= */

app.get("/games", (req, res) => {

    db.all(

        "SELECT * FROM games",

        [],

        (err, rows) => {

            if(err){

                return res.status(500).json({

                    success:false

                });

            }

            res.json(rows);

        }

    );

});

app.listen(PORT, ()=>{

    console.log(`Server running on http://localhost:${PORT}`);

});

/* =========================
   GET ONE GAME
========================= */

app.get("/games/:id", (req, res) => {

    const id = req.params.id;

    db.get(

        "SELECT * FROM games WHERE id = ?",

        [id],

        (err, row) => {

            if(err){

                return res.status(500).json({

                    success:false

                });

            }

            res.json(row);

        }

    );

});

/* =========================
   GET GAME SCREENSHOTS
========================= */

app.get("/games/:id/screenshots", (req, res) => {

    const gameId = req.params.id;

    db.all(

        "SELECT * FROM screenshots WHERE gameId = ?",

        [gameId],

        (err, rows) => {

            if(err){

                return res.status(500).json({

                    success:false

                });

            }

            res.json(rows);

        }

    );

});

/* LOGIN */

app.post("/login", (req, res) => {

    const { username, password } = req.body;

    db.get(

        `SELECT * FROM users
         WHERE username = ?
         AND password = ?`,

        [username, password],

        (err, row) => {

            if(err){

                return res.status(500).json({
                    success:false
                });

            }

            if(!row){

                return res.json({

                    success:false,

                    message:"Invalid username or password."

                });

            }

            res.json({

                success:true,

                user:row

            });

        }

    );

});

/* =========================
   RATE GAME
========================= */

app.post("/ratings", (req, res) => {

    const {

        userId,
        gameId,
        rating

    } = req.body;

    db.get(

        "SELECT * FROM ratings WHERE userId=? AND gameId=?",

        [userId, gameId],

        (err, row) => {

            if(row){

                db.run(

                    "UPDATE ratings SET rating=? WHERE userId=? AND gameId=?",

                    [

                        rating,

                        userId,

                        gameId

                    ],

                    () => {

                        res.json({

                            success:true

                        });

                    }

                );

            }

            else{

                db.run(

                    "INSERT INTO ratings(userId,gameId,rating) VALUES(?,?,?)",

                    [

                        userId,

                        gameId,

                        rating

                    ],

                    () => {

                        res.json({

                            success:true

                        });

                    }

                );

            }

        }

    );

});

/* =========================
   GET GAME RATING
========================= */

app.get("/ratings/:gameId", (req, res) => {

    db.get(

        `SELECT AVG(rating) AS averageRating

         FROM ratings

         WHERE gameId=?`,

        [req.params.gameId],

        (err, row) => {

            res.json(row);

        }

    );

});

/* =========================
   USER RATINGS
========================= */

app.get("/ratings/user/:id", (req,res)=>{

    db.all(

`SELECT

games.title,

games.image,

ratings.rating

FROM ratings

JOIN games

ON games.id = ratings.gameId

WHERE ratings.userId=?`,

[req.params.id],

(err,rows)=>{

res.json(rows);

}

);

});

/* =========================
   UPDATE GAME
========================= */

app.put("/games/:id", (req,res)=>{

    const{

        title,
        genre,
        releaseDate,
        developer,
        publisher,
        description,
        image

    }=req.body;

    db.run(

        `UPDATE games
        SET

        title=?,
        genre=?,
        releaseDate=?,
        developer=?,
        publisher=?,
        description=?,
        image=?

        WHERE id=?`,

        [

            title,
            genre,
            releaseDate,
            developer,
            publisher,
            description,
            image,
            req.params.id

        ],

        function(err){

            if(err){

                return res.status(500).json({

                    success:false

                });

            }

            res.json({

                success:true

            });

        }

    );

});

/* =========================
   DELETE GAME
========================= */

app.delete("/games/:id",(req,res)=>{

    const id=req.params.id;

    db.run(

        "DELETE FROM screenshots WHERE gameId=?",

        [id],

        ()=>{

            db.run(

                "DELETE FROM ratings WHERE gameId=?",

                [id],

                ()=>{

                    db.run(

                        "DELETE FROM games WHERE id=?",

                        [id],

                        function(err){

                            if(err){

                                return res.status(500).json({

                                    success:false

                                });

                            }

                            res.json({

                                success:true

                            });

                        }

                    );

                }

            );

        }

    );

});