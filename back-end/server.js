const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host : process.env.DB_HOST,
    user : process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_NAME

})

db.connect((err) => {
    if (err) throw err;
    console.log("Connected to MySQL database.");
});
//user registration route
app.post("/register",(req,res)=>{
    const {name,email,password} = req.body;
    db.query("insert into users (name,email,password) values(?,?,?)",[name,email,password],(err,result)=>{
        if(err) return res.status(500).json({error : err.message})
            res.json({Message : "User registered successfully ",id:result.insertId})
    })
})



//login  route
app.post("/login",(req,res)=>{
const {email,password} = req.body;
db.query("select * from users where email = ? AND password = ?",[email,password],(err,result)=>{
    if(err) return res.status(500).json({error : err.message});

    if(result.length > 0 && email == "admin@gmail.com" && password == "Admin@123"){
        res.json({message : "Admin logged in successfully", admin: result[0] })
    }
    else if(result.length > 0){
        res.json({message : "User logged in successfully"})
    }
    else{
        res.json({message : "Invalid username or password"})
    }
})
}) 

//getting all users route
app.get("/users",(req,res)=>{
    db.query("select * from users",(err,result)=>{
        if(err) return res.status(500).send(err);
        res.json(result)
    })
})

//posting blog route
app.post("/blog",(req,res)=>{
    const {title,content,author,catagorie,email}=req.body;
    db.query("insert into  blogs (title,content,author,catagorie,email) values(?,?,?,?,?)",[title,content,author,catagorie,email],(err,result)=>{
if(err) return res.status(500).send(err);
res.json({id: result.insertId,title,content,author,catagorie,email, completed:0})
    })
})

//getting all blog post 
app.get("/blogs",(req,res)=>{
    db.query("select * from blogs",(err,result)=>{
        if(err) return res.status(204).send(err);
        res.json(result)
    })
})

//getting blogs with author name
app.get("/blogs/:title",(req,res)=>{
    const title = req.params.title;
    db.query("SELECT * FROM blogs WHERE title = ?",[title],(err,result)=>{
        if(err) return res.status(404).send(err);
        res.json(result);
    })
})

app.get("/blogs/catagorie/:catagorie", (req, res) => {
    const catagorie = req.params.catagorie; // ✅ Correct
    db.query("SELECT * FROM blogs WHERE catagorie = ?", [catagorie], (err, result) => {
        if (err) return res.status(500).send(err); // better to use 500 for server error
        res.json(result);
    });
});


//updating the blog 
app.put("/blogs/:id",(req,res)=>{
    const {id} = req.params
    const {title,content,author,catagorie} = req.body
    db.query("UPDATE blogs SET title = ?, content = ?, author = ?, catagorie = ? WHERE id = ?",[title,content,author,catagorie,id],(err,result)=>{
        if(err) return res.status(500).json({error : "Update failed"})
            res.json({Message : "Blog Details Updated"})
    })
})

// deleting the blog
app.delete("/blogs/:id",(req,res)=>{
    const {id} = req.params;
    db.query("DELETE FROM blogs WHERE id = ?",[id],(err,result)=>{
        if(err) return res.status(500).json({Error : "Deletion failed"});
        res.json({message : "The blog has been deleted successfully"})
    })
})

// Get all blogs by a specific user (author)
app.get("/user-blogs/:email", (req, res) => {
    const { email } = req.params;
    db.query("SELECT * FROM blogs WHERE email = ?", [email], (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result);
    });
});

// Update a blog by ID
app.put("/blog/:id", (req, res) => {
    const { id } = req.params;
    const { title, content, author, catagorie } = req.body;
    const sql = "UPDATE blogs SET title = ?, content = ?, author = ?, catagorie = ? WHERE id = ?";
    db.query(sql, [title, content, author, catagorie, id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.send("Blog updated successfully.");
    });
});

// Delete a blog by ID
app.delete("/blog/:id", (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM blogs WHERE id = ?", [id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.send("Blog deleted successfully.");
    });
});


app.listen(5000,()=> console.log("The server is running on port 5000"))