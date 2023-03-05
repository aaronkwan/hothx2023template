const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

connection = "mongodb+srv://aaronkwan:Zekemongodb128@fullstackv1.lqn0ait.mongodb.net/test";

mongoose.set('strictQuery', false);

mongoose
.connect(
    connection, 
    { useNewUrlParser: true, useUnifiedTopology: true})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

//express app:
const app = express();
app.use(express.json());
app.listen(8080,()=> console.log('Server listening on port 8080'));
app.use(cors());

//import POST from mongoose:
const Post = require('./models/post');

//get posts when HTTP GET:
app.get('/feed', async (req, res) => {
    const feed = await Post.find();
    res.json(feed);
});

//post posts when HTTP POST:
app.post('/feed/new', async (req, res) => {
    const post = new Post   ({
    content: req.body.content,
    user: req.body.user,
    timestamp: Date.now()
});
    await post.save();
    res.json(post);
});

//edit posts when HTTP PUT:
app.put('/feed/edit/:_id', async (req, res) => {
    const post = await Post.findById(
        {_id: req.params._id},
        {content: req.body.content},
    );
    post.save();
    res.json(post);
 });

 //delete posts when HTTP DELETE:
    app.delete('/feed/delete/:_id', async (req, res) => {
        const post = await Post.findByIdAndDelete(
            {_id: req.params._id}
        );
        res.json(post);
    });

//like post when HTTP PUT:
app.put('/feed/like/:_id', async (req, res) => {
    const post = await Post.findById(req.params._id);
    post.num_likes++;
    post.save();
    res.json(post);
});


//import USER from mongoose:
const User = require('./models/user');

// Get all users
app.get('/users', async (req, res) => {
    const users = await User.find();
  
    res.json(users);
  });
  
  // Create new user 
app.post('/users/new', async (req, res) => {
  console.log(req);
  
    const dupUser = await User.findOne({ username: req.body.username });
    if (dupUser) {
      res.json({ 'error' : 'Duplicate username exists.'})
      return;
    }
    const user = new User({
      username: req.body.username,
      password: req.body.password,
    });
    await user.save();
    res.json(user);
    console.log(dupUser);
  });
  
  // Delete user
  app.delete('/users/delete/:_id', async (req, res) => {
    const result = await User.findByIdAndDelete(req.params._id);
  
    res.json(result);
  });
  
  // Edit user information
  app.put('/users/edit/:_id', async (req, res) => {
    const user = await User.findById(req.params._id);
  
    user.username = req.body.username;
    user.password = req.body.password;
    user.save();
  
    res.json(user);
  });

  // LOGIN:
app.post('/login', async (req, res) => {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      res.json({ 'error': 'That username doesn\'t exist'})
      return;
    }
  
    if (user.password === req.body.password) {
      res.json(user);
    }
    else {
      res.json({ 'error': 'Incorrect password'})
    }
  });

  // MAKE NEW USER: 
app.post('/users/new', async (req, res) => {
    const dupUser = await User.findOne({ username: req.body.username });
    if (dupUser) {
      res.json({ 'error' : 'Duplicate username exists.'})
      return;
    }
    const user = new User({
      username: req.body.username,
      password: req.body.password,
    });
  
    await user.save();
  
    res.json(user);
  });