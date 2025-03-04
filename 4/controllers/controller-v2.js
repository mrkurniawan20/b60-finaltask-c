const icon = {
  iconPath: '/assets/img/icon.jpg',
  cssPath: '/assets/css/style.css',
};

const { Sequelize } = require('sequelize');
const bcrypt = require('bcrypt');

const config = require('../config/config.json');
const { Collection, User, Task } = require('../models');

const saltRounds = 10;

const sequelize = new Sequelize(config.development);

async function renderIndex(req, res) {
  const user = await req.session.user;
  const collections = await Collection.findAll({
    include: {
      model: User,
      as: 'user',
      attributes: { exclude: ['password'] },
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
    user: user,
    collections: collectionsTask,
    title: 'Home',
    currentPage: 'home',
    ...icon,
  });
}
async function renderLogin(req, res) {
  const user = await req.session.user;
  if (user) {
    req.flash('success', 'You already Logged In');
    res.redirect('/');
  } else {
    res.render('auth-login', {
      user: user,
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
      user: user,
      currentPage: 'register',
      title: 'Register',
      ...icon,
    });
  }
}

async function authLogin(req, res) {
  const { email, password } = req.body;

  const user = await User.findOne({
    where: {
      email: email,
    },
  });

  if (!user) {
    req.flash('error', 'User does not exist');
    return res.redirect('/login');
  }

  const isValidated = await bcrypt.compare(password, user.password);

  if (!isValidated) {
    req.flash('error', 'Password incorrect');
    return res.redirect('/login');
  }
  let loggedInUser = user.toJSON();

  delete loggedInUser.password;

  req.session.user = loggedInUser;
  req.flash('success', `Login Succeed, Welcome ${user.name}`);
  res.redirect('/');
}

async function authRegister(req, res) {
  const { username, email, password, confirmPassword } = req.body;
  if (password != confirmPassword) {
    req.flash('error', 'Password is not the same');
    return res.redirect('/register');
  }
  const user = await User.findOne({
    where: {
      email: email,
    },
  });
  if (user) {
    req.flash('error', 'Email already exist');
    return res.redirect('/register');
  }

  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const newUser = {
    username,
    email,
    password: hashedPassword,
  };

  const insertUser = await User.create(newUser);
  req.flash('success', 'Register succeed!');
  res.redirect('/login');
}

async function authLogout(req, res) {
  req.session.user = null;
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
      attributes: { exclude: ['password'] },
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
