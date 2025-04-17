const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById('67f4acd850547f05b0b66388')
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

let connectToDB = async () => {
  try {
    let result = mongoose.connect('mongodb://0.0.0.0:27017/mongoose', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    User.findOne().then(user => {
      if (!user) {
        let user = new User({
          name: 'Pushkar',
          email: 'a@a.a',
          cart: {
            items: []
          }
        });
        user.save();
      }
    });

    app.listen(3000);
    console.log(`server runnong at ${3000} and ${result}`);
  } catch (err) {
    console.log(err);
  }
}
connectToDB();

