const express = require('express');
const path = require('path');
const handlebars = require('express-handlebars');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const app = express();
const port = 3000;
const route = require('./routes');
const db = require('./config/db');
const auth = require('./app/middlewares/auth');
const setUser = require('./app/middlewares/setUser');
const helpers = require('./helpers/handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(cookieParser());
app.use(require('./app/middlewares/SortMiddleware'));
app.use(auth);
app.use(setUser);

const hbs = handlebars.create({
  extname: '.hbs',
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  },
  helpers: {
    eq: function (a, b) {
      return a === b;
    },

    ne: function (a, b) {
      return a !== b;
    },

    formatCurrency: helpers.formatCurrency,
    multiply: helpers.multiply,
    sortable: helpers.sortable,
  },
  partialsDir: path.join(__dirname, 'resources', 'views', 'partials'),
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources', 'views'));

db.connect();

route(app);

app.listen(port, () => console.log(`Listening on http://localhost:${port}`));
