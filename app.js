var express = require("express");
var app  = express();
var request = require("request");
var bodyParser = require('body-parser');
var mongoose = require("mongoose");
var passport = require("passport");
var user = require("./models/user.js");
var cart = require("./models/cart.js");
var query  = require("./models/query.js");
var eatable = require("./models/eatables.js");
var complaint = require("./models/complaintDb.js");
var info  =require("./models/userInfo.js");
var comment  =require("./models/comments.js");
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
// complaint.deleteMany({},function(err){
//     if(!err){
//       console.log("ehy") 
//     }
// })
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
function isVendor(req,res,next){
    info.find({username:req.user.username},function(err, info) {
        if(!err){
            if(info[0].vendor){
                
                return next();
                
            }
            req.flash("error","You have to be a Vendor to authorise this action")
            res.redirect("/");
            
        }
    })
    
    
    
    
    
}
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
app.get("/allvendors",isLoggedIn,function(req, res) {
    
    info.find({username:req.user.username},function(err, infos) {
        if(!err){
            
            if(!infos[0]){
                
                info.find({vendor:1},function(err,vendors){
                    if(!err){
                        
                        
                         res.render("allVendors.ejs",{info:"no",vendors:vendors})
                    }
                    
                    
                    
                })
                
                
                
            }else{
                
                info.find({vendor:1},function(err,vendors){
                    if(!err){
                        
                        
                         res.render("allVendors.ejs",{info:infos[0],vendors:vendors})
                    }
                    
                    
                    
                })
                
                
               
                
            }
            
            
            
            
        }
    })
    
    
    
    

    
    
})
app.get("/listitems/:username",function(req, res) {
    
    info.find({username:req.user.username},function(err, infos) {
        if(!err){
            
            if(!infos[0]){
                
                info.find({vendor:1},function(err,vendors){
                    if(!err){
                        eatable.find({username:req.params.username},function(err, eatable) {
                            if(!err){
                                
                            res.render("listItems.ejs",{info:"no",vendors:vendors,eatable:eatable})

                                
                                
                                
                            }
                        })
                        
                        
                        
                        
                        
                        
                        
                    }
                    
                    
                    
                })
                
                
                
            }else{
                
                info.find({vendor:1},function(err,vendors){
                    if(!err){
                        
                        
                        
                        eatable.find({username:req.params.username},function(err, eatable) {
                            if(!err){
                                
                            res.render("listItems.ejs",{info:infos[0],vendors:vendors,eatable:eatable})

                                
                            }
                        })
                        
                    }
                    
                    
                    
                })
                
                
               
                
            }
            
            
            
            
        }
    })
    
    
    
    
})
app.get("/additem/:name/:price/:username",function(req, res) {
     cart.create({username:req.user.username,item:req.params.name,price:req.params.price},function(err,cart){
                if(!err){
                   
                    console.log(cart)
                    cart.save();
                    res.redirect("/listitems/" + req.params.username);
                }
                
            })
    
})
app.get("/cart",isLoggedIn,function(req, res) {
    var cost = 0;
    cart.find({username:req.user.username},function(err, cart) {
        if(!err){
            
            for(var i = 0;i<cart.length;i++){
                
                cost = cost  + parseInt(cart[i].price);
                
            }
            
            
            
            res.render("cart.ejs",{cart:cart,cost:cost})
            
        }
        
        
        
    })
    
    

})
app.get("/delete/item/:id",function(req, res) {
    cart.findByIdAndRemove(req.params.id,function(err){
        if(!err){
            res.redirect("/cart")
        }
        
        
        
    })
})


app.get("/pay",function(req, res) {
    var cost = 0;
  info.find({username:req.user.username},function(err, info) {
      if(!err){
          cart.find({username:req.user.username},function(err, cart) {
              if(!err){
                  for(var i = 0;i<cart.length;i++){
                
                cost = cost  + parseInt(cart[i].price);
                
            }
            
            
           
            
            
            res.render("mailSender.ejs",{cart:cart,info:info[0],cost:cost})
                  
                  
                  
                  
                  
              }
          })
          
          
          
          
          
      }
      
      
      
  })  
    
    
    
})

app.get("/query",function(req, res) {
    query.find({},function(err, query) {
    if(!err){
        
        res.render("query.ejs",{query:query})
        
    }    
    })
    
    
    
})
app.get("/newquery",function(req, res) {
    res.render("newquery.ejs")
})

app.post("/newquery",isLoggedIn,function(req, res) {
    query.create({username:req.user.username,ques:req.body.ques},function(err, query) {
        if(!err){
            console.log(query)
            query.save()
            res.redirect("/query")
        }
    })
    
    
})
app.get("/query/comments/:id",isLoggedIn,function(req, res) {
    query.findById(req.params.id,function(err,query){
        if(!err){
            
            comment.find({query_id:req.params.id},function(err, comments) {
                if(!err){
                        console.log(comments)
                        res.render("comments.ejs",{query_id:req.params.id,comments:comments,query:query})

                }else{
                    console.log("hey")
                }
            })
            
            
        }
        
        
    })

})


app.get("/newcomment/:id",isLoggedIn,function(req, res) {
    
    res.render("newcomment.ejs",{query_id:req.params.id})
    
})
app.post("/newcomment/:id",function(req, res) {
    comment.create({query_id:req.params.id,username:req.user.username,comment:req.body.comment},function(err, comment) {
        if(!err){
            console.log("comment created")
            comment.save()
            res.redirect("/query/comments/"+ req.params.id)
        }
    })
    
    
})
app.get("/comments/delete/:id1/:id2",function(req, res) {
    comment.findByIdAndRemove(req.params.id1,function(err) {
        if(!err){
            
            res.redirect("/query/comments/" + req.params.id2)
            
        }
    })
})
app.get("/query/delete/:id",function(req, res) {
    query.findByIdAndRemove(req.params.id,function(err) {
        if(!err){
            res.redirect("/query")
        }
    })
})
app.get("/complaint",function(req, res) {
    info.find({username:req.user.username},function(err,info){
     if(!err){
        
        
        
         if(info[0].vendor){
             
             complaint.find({vendor:info[0].name},function(err,complaints){
                 if(!err){
                     
                   res.render("complaint.ejs",{complaints:complaints})  
                     
                 }
                 
                 
             })
             
             
             
             
         }else{
             complaint.find({username:req.user.username},function(err, complaints) {
                 if(!err){
                     
                     res.render("complaint.ejs",{complaints:complaints})
                     
                 }
             })
             
             
         }
         
     }   
        
        
    })
    
    
    
    
})
app.get("/newcomplaint",function(req, res) {
    res.render("newcomplaint.ejs")
})
app.post("/newcomplaint",function(req, res) {
    complaint.create({username:req.user.username,complaint:req.body.complaint,phNo:req.body.phNo,vendor:req.body.vendor,vendorSol:0,customerSol:0},function(err, complaint) {
        if(!err){
            console.log(complaint)
            res.redirect("/complaint")
            
        }
    })
})
app.get("/complaint/solved/:id",isVendor,function(req, res) {
    complaint.findById(req.params.id,function(err,complaint){
        if(!err){
            console.log("hey")
            complaint.vendorSol = 1;
            complaint.save()
            res.redirect("/complaint")
        }
        
        
        
    })
    
    
})
app.listen(process.env.PORT,process.env.IP);