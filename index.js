const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const { response } = require('express');
var _ = require('lodash');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


const about = "It's not enough just to answer someone's questions — you also have to provide actionable steps while being engaging. For instance, your introduction should hook the reader and make them want to continue reading your post. Then, use examples to keep your readers interested in what you have to say.";

var globalArr = [];




var id;
var name = "";


app.get('/', (req, res) => {
    console.log(globalArr);
    res.render('home', {globalarr: globalArr});
})

app.get('/about', (req, res) => {
    res.render('about', {ab: about});
})

app.get('/contact', (req, res) => {
    res.render('contact');
})


app.get('/compose', (req, res) => {
    res.render('compose');
})

app.post('/compose', (req, res) => {
    var globalObject = {
        personId: [],
        personName: "",
        arr: []
    }
    var post = {
        pageInfo: req.body.compose,
        titleInfo: req.body.title,
        link: _.lowerCase(req.body.title)
    }

    if(globalArr.length < 1){
        globalObject.personId.push(id);
        globalObject.personName = name;
        globalObject.arr.push(post);
        globalArr.push(globalObject);
    }
    else{
            var flag = 0;
            var pos = -1;
            var i = 0;
            for(; i < globalArr.length; i++){
                if(id == globalArr[i].personId){
                    flag = 1;
                    pos = i;
                }
            }
            if(flag === 1){
                globalArr[pos].arr.push(post);
            }
            else{
                globalObject.personId.push(id);
                globalObject.personName = name;
                globalObject.arr.push(post);
                globalArr.push(globalObject);        
            }

    }

    res.redirect('/');
})

app.post('/delete', (req, res) => {
    var a = globalArr.length;
    var b = globalArr[a-1].arr.length;
    
    globalArr[a-1].arr.splice(b-1, 1);
    if(b === 0){
        globalArr.splice(a-1,1);
    }
    res.redirect('/');
})

app.get('/users/:postName', function (req, res) {
    const requestTitle = _.lowerCase(req.params.postName);
    arr.forEach(function(element) {
        if(requestTitle === _.lowerCase(element.titleInfo)){
            res.render('specific', {titleInfo: element.titleInfo, pageInfo: element.pageInfo});

        }
    })
})

app.post('/', (req, res) => {
    var searchResult = req.body.srch;
    var j = 0;
    globalArr.forEach(function(element) {
        if(searchResult === element.personName){
            console.log(searchResult);
            res.render('personal-blog', {globalarr: element, i: j});
        }
        else{
            res.redirect('/');
        }
        j++;
    })
})






app.get('/logto', (req, res) => {
    res.render('person-home');
})

app.post('/logto', (req, res) => {
    id = req.body.loginfo;
    name = req.body.name;
    res.redirect('/compose');
})

app.get('/person/:userid', function (req, res) {
    const personId = req.params.userid;
    arr.forEach(function(element) {
        if(personId === element.id){
            res.render('personal-blog', {arr: arr, personalId: personId});

        }
    })
})










app.listen(process.env.PORT || 3000, () => {
    console.log('Server is running on port 3000');
});