const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const { response } = require('express');
const mongoose = require('mongoose');
const md5 = require('md5');
var _ = require('lodash');

const app = express();

app.set('view engine', 'ejs');
mongoose.set('useFindAndModify', false);


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


mongoose.connect("mongodb+srv://surya-admin:test@1234@cluster0.ilsr2.mongodb.net/bloguserdb", {
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true
}).then(() => {
    console.log("Database successfull");
}).catch((e) => {
    console.log("No connection");
})

// this is registration data schema
const registrationSchema = {
    Name : {
        type : String,
        required : true
    },
    Email : {
        type : String,
        required : true
    },
    Password : {
        type : String,
        required : true,
    }
}

const Registration = mongoose.model("Registration", registrationSchema);

// this schema is created to store same users data at one place
var temp_password = "";
var temp_email = "";
const itemsSchema = {
    Name : {
        type : String,
        required : true
    },
    Email : {
        type : String,
        required : true
    },
    Password : {
        type : String,
        required : true,
    },
    Content : [{
        Title : {
            type : String
        },
        Post : {
            type : String
        }
    }]
};

const Item = mongoose.model("Item", itemsSchema);

// this schema is created to store user's data time wise
var name = "";
const newestSchema = {
    Name : {
        type : String,
        required : true
    },
    Content : {
        Title : {
            type : String
        },
        Post : {
            type : String
        }
    }

}

const NewItem = mongoose.model("NewItem", newestSchema);

app.get('/', (req, res) => {
    console.log(Item);
    NewItem.find((error, users) => {
        if(error){
            console.log(error);
        } else {
            res.status(201).render("home", {globalarr: users});
        }
    })
})

app.get('/register', (req, res) => {
    res.render("registration");
})

app.post('/register', (req, res) => {
    const name = req.body.name;
    const Password = md5(req.body.password);
    const email = req.body.email;
    Registration.findOne({Email: email}, async (error, regData) => {
        if(error){
            console.log(error);
        } else {
            if(!regData){
                const authorsRegData = new Registration({
                    Name: name,
                    Email: email,
                    Password: Password
                })
                const registered = await authorsRegData.save();
                res.redirect("/logto");
            } else {
                console.log("Found");
                res.redirect("/logto");
            }
        }
    })
})

app.get('/logto', (req, res) => {
    res.render("person-home");
})

app.post('/logto', async (req, res) => {
    try{
        const name = req.body.name;
        const Password = md5(req.body.password);
        const email = req.body.email;
        temp_password = Password;
        user_name = name;
        temp_email = email;


        Registration.findOne({Email: email, Password: Password}, async (error, regData) => {
            if(error){
                console.log(error);
            } else {
                if(!regData){
                    res.redirect("/register");
                } else {
                    Item.findOne({Email: email, Password: Password}, async (error, match) => {
                        if(error){
                            console.log(error);
                        }
                        if(!match){
                            console.log("Match does not found.")
                            const authorsCollection = new Item({
                                Name: name,
                                Password: Password,
                                Email: email
                            })
                            const registered = await authorsCollection.save();

                            res.render("compose");
                        } else {
                            console.log("Found!!");
                            res.render("compose");
                        }
                    })
                }
            }
        })


        // Item.findOne({Email: email}, async (error, match) => {
        //     if(error){
        //         console.log(error);
        //     }
        //     if(!match){
        //         console.log("Match does not found.")
        //         const authorsCollection = new Item({
        //             Name: name,
        //             Password: Password,
        //             Email: email
        //         })
        //         const registered = await authorsCollection.save();

        //         res.render("compose");
        //     } else {
        //         console.log("Found!!");
        //         res.render("compose");
        //     }
        // })

    } catch (error) {
        res.status(400).send(error);
    }
})

app.post('/compose', async (req, res) => {
    try {
        console.log(temp_password);

        var newUserData = {
            Title: req.body.title,
            Post: req.body.post
        }
        var user_data = {
            Title: req.body.title,
            Post: req.body.post
        }
        
        const newPost = new NewItem({
            Name: user_name,
            Content: user_data
        });
        newPost.save();
        console.log(newUserData);
// *************************************************************************************************************************************************
        Item.findOneAndUpdate({Password: temp_password}, {$push: { Content: newUserData }}, (error, data) => {
            if(error){
                console.log("error");
            } else {
                console.log("Item*");
            }
        });
        

        NewItem.find((error, users) => {
            if(error){
                console.log(error);
            } else {
                res.status(201).render("home", {globalarr: users});
            }
        })
        
    res.redirect("/");
    } catch (error) {
        res.status(400).send(error);
    }
})

app.post('/', (req, res) => {
    var name = req.body.srch;
    Item.find({Name: name}, (error, singleUser) => {
        if(error){
            console.log(error);
        } else {
            if(!singleUser.length){
                console.log("Coud not Found this user");
                res.send("Could not found user");
            } else {
                console.log(singleUser);
                res.render("personal-blog", {userArr: singleUser});
            }
        }
    })
})

app.get('/person/:userid', function (req, res) {
    var titleName = req.params.userid;
    NewItem.find((error, content) => {
        if(error){
            console.log(error);
        } else {
            console.log(content);
            res.render("singlePost", {arr: content, match: titleName});
        }
    })
})

app.get("/about", (req, res) => {
    res.render("about");
})

app.get("/contact", (req, res) => {
    res.render("contact");
})


app.listen(process.env.PORT || 3000, () => {
    console.log('Server is running on port 3000');
});