const icon = {
  iconPath: '/assets/img/icon.jpg',
  cssPath: '/assets/css/style.css',
};

const { Sequelize } = require('sequelize');
const bcrypt = require('bcrypt');

const config = require('../config/config.json'); //ambil config
const { Collection, User, Task } = require('../models'); //ambil Blog, sama User, ini table yang ada di sql

const saltRounds = 10;

const sequelize = new Sequelize(config.development); //const sequelize buat masukin config ke function sequelize

async function renderIndex(req, res) {
  const user = await req.session.user; //untuk masukin session ke web page index
  const collections = await Collection.findAll({
    include: {
      model: User,
      as: 'user', //manggil assosiates model user pake variable user. jadi bisa ambil blog.user.name (nama dari user, foreign key nya dari authorID)
      attributes: { exclude: ['password'] }, //untuk exclude password just in case someone could see
    },
    order: [['createdAt', 'DESC']],
  });

  const collectionsTask = await Promise.all(
    collections.map(async (collection) => {
      const TaskCompleted = await Task.count({
        where: {
          collections_id: collection.id,
          is_done: true,
        },
      });
      const TaskTotal = await Task.count({
        where: {
          collections_id: collection.id,
        },
      });
      return {
        ...collection.toJSON(),
        TaskCompleted,
        TaskTotal,
      };
    })
  );

  res.render('index', {
    user: user, //deklarasi user nya biar kena detect function session di web page tsb
    collections: collectionsTask,
    title: 'Home',
    currentPage: 'home',
    ...icon,
  });
}
async function renderLogin(req, res) {
  const user = await req.session.user; //untuk masukin session ke web page login
  if (user) {
    req.flash('success', 'You already Logged In');
    res.redirect('/');
  } else {
    res.render('auth-login', {
      user: user, //deklarasi user nya biar kena detect function session di web page tsb
      currentPage: 'login',
      title: 'Login',
      ...icon,
    });
  }
}
async function renderRegister(req, res) {
  const user = await req.session.user;
  if (user) {
    req.flash('success', 'You already Logged In');
    res.redirect('/');
  } else {
    res.render('auth-register', {
      user: user, //deklarasi user nya biar kena detect function session di web page tsb
      currentPage: 'register',
      title: 'Register',
      ...icon,
    });
  }
}

async function authLogin(req, res) {
  const { email, password } = req.body;
  // console.log(req.body);
  const user = await User.findOne({
    //nyari email di db buat mastiin kalo email yang diregister tidak boleh sama persis kaya email yang udah terdaftar
    //mencari satu db, dengan condition WHERE di bawah
    where: {
      //condition WHERE untuk mencari db
      email: email,
    },
  });
  //check kalau usernya ada
  if (!user) {
    //if disini conditional nya false, karena (!user) kalo (user) jadi conditional nya true
    //if condition kalo email yang dimasukin gaada
    req.flash('error', 'User does not exist'); //error notif, string argumen yang pertama, buat ngasih tau kalo 'error'. itu assigned value, argumen string kedua itu kalimat yang mau dimasukin di error nya
    return res.redirect('/login');
  }

  //check kalau password salah
  const isValidated = await bcrypt.compare(password, user.password); //comparing password yang diinput di login page(password) sama password yang ada di db yang udah dihashing(user.password), pake bcrypt.compare karena passwordnya harus dihashing dulu

  if (!isValidated) {
    //const isValidated di atas itu hasilnya boolean, nah ini conditionnya jika TIDAK true atau jika false
    //kalo engga valid alias password ga sama
    req.flash('error', 'Password incorrect'); //error notif, string argumen yang pertama, buat ngasih tau kalo 'error'. itu assigned value, argumen string kedua itu kalimat yang mau dimasukin di error
    return res.redirect('/login');
  }
  let loggedInUser = user.toJSON(); //parsing user yang tadinya tipe data object ke JSON
  // console.log(loggedInUser); //console log user semua
  //hapus passowrd di session
  delete loggedInUser.password; //delete ini assigned fucntion yang udh ada,
  // console.log(loggedInUser); //console log user setelah password didelete

  req.session.user = loggedInUser; // JSON user yang ada diganti dengan user yang sudah login
  req.flash('success', `Login Succeed, Welcome ${user.name}`); //********butuh ditanya, karena yang dijelasin ka leo pake 'loggedInUser.name' tapi cuma pake 'user.name' bisa
  res.redirect('/');
}

async function authRegister(req, res) {
  const { username, email, password, confirmPassword } = req.body;
  if (password != confirmPassword) {
    //konfirmasi password
    req.flash('error', 'Password is not the same'); //error kalo password sala
    return res.redirect('/register');
  }
  const user = await User.findOne({
    //nyari email di db buat mastiin kalo email yang diregister tidak boleh sama persis kaya email yang udah terdaftar
    where: {
      //condition nyari jika email yang diregister sama dengan email di db
      email: email,
    },
  });
  if (user) {
    //if disini conditional nya true alias jika user yang dicari ditemukan maka req.flash error
    req.flash('error', 'Email already exist');
    return res.redirect('/register');
  }

  const hashedPassword = await bcrypt.hash(password, saltRounds); //declare const buat hashing, bcrypt.hash function hashing nya, argumen pertama password yang dimasukin, argumen kedua berapa kali hashing nya, di atas udah dipakein variable 10 di saltRounds
  const newUser = {
    //bikin user baru dengan password yang sudah di hashing
    username,
    email,
    password: hashedPassword, //assigning variable password pake hashedPassword diatas
  };

  const insertUser = await User.create(newUser); //User.create(newUser) artinya, database User create user baru dengan const object newUser diatas, jika create(User) tanpa pake newUser, maka yang dimasukin password yang belum dihashing
  req.flash('success', 'Register succeed!');
  res.redirect('/login');
}

async function authLogout(req, res) {
  //hapus user dari session
  req.session.user = null; //keluarin session
  res.redirect('/login');
}

async function addCollection(req, res) {
  const user = await req.session.user;
  const name = req.body.name;

  const newCollection = {
    name,
    user_id: user.id,
  };
  const resultSubmit = await Collection.create(newCollection);
  res.redirect('/');
}

async function renderCollection(req, res) {
  const id = req.params.id;
  const user = await req.session.user;
  const chosenCollection = await Collection.findOne({
    include: {
      model: User,
      as: 'user',
      attributes: { exclude: ['password'] },
    },
    where: {
      id: id,
    },
  });
  const chosenTask = await Task.findAll({
    include: {
      model: Collection,
      as: 'collection',
    },
    where: {
      collections_id: chosenCollection.id,
    },
    order: [['createdAt', 'DESC']],
  });
  const TaskCompleted = await Task.count({
    where: {
      collections_id: chosenCollection.id,
      is_done: true,
    },
  });

  const TaskUncompleted = await Task.count({
    where: {
      collections_id: chosenCollection.id,
      is_done: false,
    },
  });
  await res.render('collection', {
    user: user,
    collection: chosenCollection,
    task: chosenTask,
    title: 'Blog Details',
    currentPage: 'blog',
    TaskCompleted: TaskCompleted,
    TaskUncompleted: TaskUncompleted,
    TaskTotal: TaskCompleted + TaskUncompleted,
    ...icon,
  });
}

async function addTask(req, res) {
  const id = req.params.id;
  const user = await req.session.user;
  const name = req.body.name;
  const chosenCollection = await Collection.findOne({
    include: {
      model: User,
      as: 'user',
      attributes: { exclude: ['password'] }, //untuk exclude password just in case someone could see
    },
    where: {
      id: id,
    },
  });

  const newTask = {
    name,
    is_done: false,
    collections_id: chosenCollection.id,
  };
  const result = Task.create(newTask);
  res.redirect(`/collection/${id}`);
}

async function updateTask(req, res) {
  const id = req.params.id;
  const checkbox = req.body.checkbox;
  const result = await Task.update({ is_done: 'true', updateAt: sequelize.fn('NOW') }, { where: { id: id } });
  res.redirect('back');
}

async function uncheckTask(req, res) {
  const id = req.params.id;
  const checkbox = req.body.checkbox;
  const result = await Task.update({ is_done: 'false', updateAt: sequelize.fn('NOW') }, { where: { id: id } });
  res.redirect('back');
}

async function deletetask(req, res) {
  const id = req.params.id;
  const result = await Task.destroy({ where: { id: id, is_done: true } });
  res.redirect('back');
}

async function editCollection(req, res) {
  const id = req.params.id;
  const user = await req.session.user;
  const name = req.body.name;

  const result = await Collection.update(
    {
      name: name,
      updateAt: sequelize.fn('NOW'),
    },
    {
      where: {
        id,
      },
    }
  );
  res.redirect(`/collection/${id}`);
}

async function deleteCollection(req, res) {
  const collectionId = req.params.id;

  await Task.destroy({
    where: { collections_id: collectionId },
  });

  await Collection.destroy({
    where: { id: collectionId },
  });
  res.redirect('/');
}
module.exports = {
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
};
