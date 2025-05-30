const express = require('express');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const app = express();
const path = require('path');
const userModel = require('./models/user'); // Adjust the path as necessary
const jwt = require('jsonwebtoken');

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// const userModel = require('./usermodel'); // Assuming usermodel.js is in the same directory
app.get('/jwt', (req, res) => {
     const token = jwt.sign({ username: 'ahmad123'}, "secretkey");
     console.log(token);
     res.cookie('token', token); // Log the JWT to the console
     res.send('JWT has been generated and logged to the console');
});

app.get('/jwt/verify', (req, res) => {
     let data = jwt.verify(req.cookies.token, "secretkey");
     console.log(data)
     res.send(data);
})

app.get('/bcrypt', (req, res) => {
     bcrypt.genSalt(10, function (err, salt) {
          bcrypt.hash('password', salt, function (err, hash) {
               // Store hash in your password DB.
               console.log(hash); // Log the hashed password to the console
          });
          res.send('Password has been hashed and logged to the console');
     });
     bcrypt.compare('password', '$2b$10$qVQtG/cgpoi1RfhVaOH4bOiGh73UDQAhKJLW2gqcuau/b4rW/OCgO', function (err, result) {
          console.log(result); // Log the comparison result to the console
          res.send('Password comparison result has been logged to the console');
     });
});

app.get('/cookie', (req, res) => {
     res.cookie('username', 'ahmad');
     res.send('Cookie has been set');
});

app.get('/read/cookie', (req, res) => {
     console.log(req.cookies); // Log the cookies to the console
     res.send('Cookie has been read');
});

app.get('/', (req, res) => {
     res.render('index', { title: 'Home Page' });
});

// app.get('/create', async (req, res) => {
//      let createdUser = await userModel.create({
//         name: 'Taimoor',
//         username: 'taimoor123',
//         email: 'taimoorfarid@gmail.com'     
//      });

//      res.send(createdUser);
//      console.log('User created successfully');
// });

// Created for an ejs template to create a user
app.post('/create', async (req, res) => {
     let { name, email, image } = req.body;

     let createdUser = await userModel.create({
          name,
          email,
          imageUrl: image
     });

     //     res.send(createdUser);
     res.redirect('/read'); // Redirect to the read page after creation
});

app.get('/read', async (req, res) => {
     let users = await userModel.find();
     // res.send(users);
     res.render('read', { users, title: 'All Users' });
});

app.get('/edit/:userId', async (req, res) => {
     let user = await userModel.findOne({ _id: req.params.userId });
     res.render('edit', { user, title: 'Update User' });
});

app.post('/update/:userId', async (req, res) => {
     let userId = req.params.userId;
     let { name, email, image } = req.body;

     let updatedUser = await userModel.findOneAndUpdate(
          { _id: userId },
          { name, email, imageUrl: image },
          { new: true }
     );

     res.redirect('/read'); // Redirect to the read page after update
});

app.get('/delete/:id', async (req, res) => {
     let userId = req.params.id;
     let deletedUser = await userModel.findOneAndDelete({ _id: req.params.id });

     res.redirect('/read'); // Redirect to the read page after deletion
});

app.get('/update', async (req, res) => {
     let updatedUser = await userModel.findOneAndUpdate(
          { username: 'taimoor123' },
          { username: 'fakhar123' },
          { new: true }
     );

     res.send(updatedUser);
});

app.get('/read', async (req, res) => {
     let users = await userModel.find();
     // res.send(users);
     res.render('read', { users: users, title: 'All Users' });
});

app.get('/user', async (req, res) => {
     let users = await userModel.find({ username: 'ahmad123' });
     res.send(users);
});

app.get('/delete', async (req, res) => {
     let deletedUser = await userModel.findOneAndDelete({ username: 'taimoor123' });
     res.send(deletedUser);
});

app.listen(3000);