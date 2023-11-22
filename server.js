
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const path = require('path');
const handlebars = require('express-handlebars');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Session store
const sequelize = require('./models').sequelize;
const sessionStore = new SequelizeStore({
  db: sequelize,
});

// Session setup
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'default-secret',
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
  })
);

// Passport setup
app.use(passport.initialize());
app.use(passport.session());

// Handlebars setup
app.engine('handlebars', handlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Routes
const routes = require('./controllers');
app.use(routes);

// Sync Sequelize models and start the server
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
