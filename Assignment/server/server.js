// server/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const path = require('path');
const authRoutes = require('./routes/auth');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/image_search', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(()=>console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB err', err));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Sessions (store in Mongo for production)
app.use(session({
  secret: process.env.SESSION_SECRET || 'change_this_secret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/image_search_sessions' }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day
}));

require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  const allowed = process.env.CLIENT_URL || 'http://localhost:3000';
  res.header('Access-Control-Allow-Origin', allowed);
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use('/auth', authRoutes);
app.use('/api', apiRoutes);

app.get('/ping', (req,res)=>res.json({ ok: true }));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
