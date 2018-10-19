var express = require("express");
var app  = express();
var request = require("request");
var bodyParser = require('body-parser');
var mongoose = require("mongoose");
var passport = require("passport");
var user = require("./models/user.js");
var eatable = require("./models/eatables.js");
var info  =require("./models/userInfo.js");
var LocalStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
var flash = require("connect-flash");
mongoose.connect('mongodb://localhost:27017/fooddel',{ useNewUrlParser: true });
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require("express-session")({
    secret: "Hello there",
    resave: false,
    saveUninitialized: false
}));
app.use(flash());
console.log("hello");
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
   next();
});
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }else{
    req.flash("error","You need to be loggedIn")
    res.redirect("/login");
}};
app.get("/register",function(req,res){
    res.render("register.ejs")
    
    
})
app.post("/register", function(req, res){
    user.register(new user({username: req.body.username}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register.ejs");
        }
        passport.authenticate("local")(req, res, function(){
           res.redirect("/");
        });
    });
});

app.get("/login",function(req, res) {
    res.render("login.ejs");
});

app.post("/login", passport.authenticate("local", {
        
    successRedirect: "/",
    failureRedirect: "/login"
}) ,function(req, res){
        

    res.render("/");
});

app.get("/",function(req,res){
   
    
    if(req.isAuthenticated()){
        info.find({username:req.user.username},function(err, infos) {
        if(!err){
            
            info.find({vendor:"0"},function(err,users){
                if(!err){
                 if(!infos[0]){
                    res.render("homepage.ejs",{info:"no",count:users.length})
                    
                }else{
                    res.render("homepage.ejs",{info:infos[0],count:users.length})
                }   
                    
                }
                
            })
            
            console.log(info)
                

            
        }else{
           
   
        }
    })
    }else{
        
        info.find({vendor:"0"},function(err, users) {
            if(!err){
                    res.render("homepage.ejs",{info:"noLogin",count:users.length})

                
                
                
            }
        })
        
        
        
};
    
   
})

app.get("/logout",function(req, res) {
    req.logout();
    req.flash("success","Logged you Out!")
    res.redirect("/");
});
app.get("/enterInfo",isLoggedIn,function(req, res) {
    res.render("info.ejs");
    
    
})
app.post("/enterInfo",function(req,res){
    info.create(req.body.info,function(err,info){
                if(!err){
                    info.author = req.user;
                    info.username = req.user.username;
                    
                    
                    console.log(info);
                    // images.comments.push(comment);
                    // comment.save();
                    // images.save();
                    info.save();
                    res.redirect("/");
                }
                
            })
    
    
    
})
app.get("/editInfo",isLoggedIn,function(req, res) {
    info.find({username:req.user.username},function(err, info) {
        if(!err){
            res.render("editInfo.ejs",{info:info[0]})
            
            
        }
    })
    
    
})
app.post("/editinfo",isLoggedIn,function(req, res) {
    info.findOneAndUpdate({username:req.user.username},req.body.info,function(err,updatedInfo){
                if(!err){
                    console.log(updatedInfo);
                    res.redirect("/");
                }
            })
    
    
})
app.get("/viewInfo",isLoggedIn,function(req, res) {
    info.find({username:req.user.username},function(err,info){
        if(!err){
            console.log(info);
            res.render("viewinfo.ejs",{info:info[0]})
            
        }
    })
    
})

app.get("/entermenu",function(req, res) {
    res.render("menu.ejs")
})

app.post("/menu",function(req, res) {
    
    eatable.create(req.body.menu,function(err,eatable){
                if(!err){
                    eatable.author = req.user;
                    eatable.username = req.user.username;
                    
                    
                    console.log(info);
                   
                    eatable.save();
                    res.redirect("/menu")
                }
                
            })
    
})
app.get("/menu",function(req, res) {
    
    eatable.find({username:req.user.username},function(err, eatable) {
        if(!err){
            
            res.render("showMenu.ejs",{eatable:eatable})
            
            
        }
        
    })
    
    
})
app.get("/delete/:id",function(req, res) {
     eatable.findByIdAndRemove(req.params.id,function(err){
        if(!err){
            res.redirect("/menu")
        }
})
})

app.listen(process.env.PORT,process.env.IP);