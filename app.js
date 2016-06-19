
var express  = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    ejs      = require('ejs')


Schema = new mongoose.Schema({
    dName : String,
    aName : String,
    dContactno: String,
    dEmail: String,
    dAddress : String,
    aType:String,
    aQuantity:String,
    postedOn: Date
}),

Blog = mongoose.model('Blog', Schema);

mongoose.connect('mongodb://piyush:abcd@ds019054.mlab.com:19054/piyush1010');


var app = express()

app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({extended: true}));
app.use('/public', express.static(__dirname + '/public'));

app.get('/api', function (req, res) {
    res.json(200, {msg: 'OK' });
})

app.get('/blogs', function (req, res) {
    // http://mongoosejs.com/docs/api.html#query_Query-find
    Blog.find({}, function ( err, blogs ){
        if(!err && blogs){
            res.render('blogs.ejs',{
                data :  blogs
            })
        } else {
            console.log(err)
        }
    });
});

app.get('/admin', function (req, res) {
    // http://mongoosejs.com/docs/api.html#query_Query-find
    Blog.find({}, function ( err, blogs ){
        if(!err && blogs){
            res.render('admin.ejs',{
                data :  blogs
            })
        } else {
            console.log(err)
        }
    });
});


app.get('/addblog', function(req, res){
    res.render('addPost.ejs')
})

app.get('/', function(req, res){
    Blog.find({}).limit(3).exec(function(err, blogs){
        if(!err && blogs){
            res.render('index.ejs',{
                data :  blogs
            })
        } else{
            console.log(err);
            res.status(500).send("something went wrong while fetching blog summary");
        }
    })
})

app.post('/api/addBlog', function (req, res) {
    var blog = new Blog(
        {
             dName: req.body.dName, 
             aName : req.body.aName,
             dContactno : req.body.dContactno,
             dEmail : req.body.dEmail,
             dAddress: req.body.dAddress,
             aType:req.body.aType,
             aQuantity:req.body.aQuantity,
             postedOn:Date.now()
        }
    );

    // http://mongoosejs.com/docs/api.html#model_Model-save
    blog.save(function (err, data) {
        if(!err && data){
            console.log('Record added successfully');
            res.redirect('/blogs')
        } else {
            res.json(500, {msg: 'Something went wrong' });
            console.log(err)
        }

    });
})

app.get('/api/blogs', function (req, res) {
    // http://mongoosejs.com/docs/api.html#query_Query-remove
    User.remove({ category: 'music' }, function ( err ) {
        if(!err){
            console.log("User deleted successfully")
        } else{
            console.log(err)
        }
    });
})

app.get('/blog/:id', function(req, res){
    Blog.findById( req.params.id, function ( err, blog ) {
        if(!err && blog){
            res.render('blogDetail.ejs',{
                data : blog
            })
        } else {
            console.log(err)
        }
    });
} )

app.get('/editBlog/:id', function(req, res){
    Blog.findById( req.params.id, function ( err, blog ) {
        if(!err && blog){
            res.render('editPost.ejs',{
                data : blog
            })
        } else {
            console.log(err)
        }
    });

})

app.post('/api/editBlog/:id', function (req, res) {
    // http://mongoosejs.com/docs/api.html#model_Model.findById
    Blog.findById( req.params.id, function ( err, blog ) {
            blog.dName = req.body.dName,
            blog.aName = req.body.aName,
            blog.dContactno = req.body.dContactno,
            blog.dEmail = req.body.dEmail,
            blog.dAddress = req.body.dAddress,
            blog.aType=req.body.aType,
            blog.aQuantity=req.body.aQuantity,
            
            // http://mongoosejs.com/docs/api.html#model_Model-save
            blog.save( function ( err, data ){
            if(!err && data){
                res.redirect('/blogs')
            } else {
                console.log(err)
            }

        });
    });
});

app.get('/api/deleteBlog/:id', function (req, res) {
    // http://mongoosejs.com/docs/api.html#model_Model.findById
    Blog.findById( req.params.id, function ( err, blog ) {
        // http://mongoosejs.com/docs/api.html#model_Model.remove
        blog.remove( function ( err ){
           console.log("Record deleted successfully")
            res.redirect('/admin')
        });
    });
});

app.listen(1015);
console.log('server running on port -->> 1015');

