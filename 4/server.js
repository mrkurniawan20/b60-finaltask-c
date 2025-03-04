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
  renderBlog,
  renderBlogDetail,
  renderBlogEdit,
  renderCreateBlog,
  renderTestimonial,
  renderForm,
  createBlog,
  deleteBlog,
  updateBlog,
  renderProjects,
  createProject,
  renderCreateProject,
  deleteProject,
  updateProject,
  renderProjectEdit,
} = require('./controllers/controller-v2'); //import modul dari js controller

app.set('view engine', 'hbs');

app.use('/assets', express.static(path.join(__dirname, './assets')));
app.use('/uploads', express.static(path.join(__dirname, './uploads')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(flash());
app.use(
  session({
    //ngasih tau kalo server menggunakan session
    name: 'my-session', //nama
    secret: 'qwertyuiop', //secret key bebas(?)
    resave: false, //??
    saveUninitialized: true, //??
  })
);

app.set('views', path.join(__dirname, './views')); //setting folder view engine
hbs.registerPartials(__dirname + '/views/partials', function (err) {}); //__dirname buat ngasih tau folder yang mau dituju jadi, BASICALLY DIRNAME ITU FOLDER YANG DIBUKA ^^ YANG DI ATAS BROOOW

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
