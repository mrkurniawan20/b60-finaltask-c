const express = require('express');
const hbs = require('hbs');
const app = express();
const path = require('path');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');

const port = 3500;
const icon = {
  iconPath: '/assets/img/icon.jpg',
  cssPath: '/assets/css/style.css',
};
('nodemon server.js');

const {
  renderIndex,
  renderLogin,
  renderRegister,
  authLogin,
  authRegister,
  authLogout,
  addCollection,
  renderCollection,
  addTask,
  updateTask,
  uncheckTask,
  deletetask,
  deleteCollection,
  editCollection,
} = require('./controllers/controller-v2');

app.set('view engine', 'hbs');

app.use('/assets', express.static(path.join(__dirname, './assets')));
app.use('/uploads', express.static(path.join(__dirname, './uploads')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(flash());
app.use(
  session({
    name: 'my-session',
    secret: 'qwertyuiop',
    resave: false,
    saveUninitialized: true,
  })
);

app.set('views', path.join(__dirname, './views'));
hbs.registerPartials(__dirname + '/views/partials', function (err) {});
hbs.registerHelper('eq', (a, b) => a === b);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

//RENDER INDEX
app.get('/', renderIndex);

//RENDER LOGIN
app.get('/login', renderLogin);
app.get('/register', renderRegister);
app.post('/auth-login', authLogin);
app.post('/auth-register', authRegister);
app.get('/logout', authLogout);

app.post('/addcollection', addCollection);

app.get('/collection/:id', renderCollection);
app.post('/collection/:id/addtask', addTask);

app.post('/task/:id/update', updateTask);
app.post('/task/:id/uncheck', uncheckTask);

app.post('/task/:id/delete', deletetask);
app.post('/collection/:id/delete', deleteCollection);
app.post('/collection/:id/edit', editCollection);
