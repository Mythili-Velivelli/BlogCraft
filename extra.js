import express from "express"
import bodyParser from "body-parser"
const app=express()
const port=3000
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended:true}))
app.set("view engine","ejs");
let posts=[]
app.get("/",(req,res)=>{
    res.render("index",{posts})
})

app.get("/new",(req,res)=>{
    res.render("modify",{heading:"Create a new Post",submit:"Publish"})
})
app.post("/submit",(req,res)=>{
    const {title,content}=req.body
    const id=Date.now()
    posts.unshift({id,title,content,date:new Date().toDateString()})
    res.redirect("/")
})
app.get("/edit/:id",(req,res)=>{
    const post=posts.find(p=>p.id == req.params.id)
    res.render("modify",{
        heading:"Edit Post",
        submit:"Update",
        post:post
    })
})

app.post("/update/:id",(req,res) => {
     const index=posts.findIndex(p=>p.id==req.params.id)
     posts[index].title=req.body.title
     posts[index].content=req.body.content
     res.redirect("/")
})
app.post("/delete/:id",(req,res)=>{
    posts=posts.filter(p=>p.id!=req.params.id)
    res.redirect("/")
})

app.listen(port,()=>{
    console.log(`Server listening at ${port}`)
})