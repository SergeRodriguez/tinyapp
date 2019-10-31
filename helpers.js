// URL database
const urlDatabase = {};

//Users database
const users = {};

// We want to check if that email exists in users db
const findUserByEmail = (email, usersDatabase) => {
  // itetrate through the usersDatabase object
  for (let userId in usersDatabase) {
    const currentUser = usersDatabase[userId];
    if (currentUser.email === email) {
      return currentUser;
    }
  }
  return false;
};

//returns the URLs where the userID is equal to the id of the currently logged in user.
const urlsForUser = id => {
  const urlsForCurrentUser = {};
  for (let url in urlDatabase) {
    if (urlDatabase[url].userID === id) {
      urlsForCurrentUser[url] = urlDatabase[url];
    }
  }
  return urlsForCurrentUser;
};

// ads a User to the users database
const addUser = (email, password, id) => {
  const newUser = {
    id,
    email,
    password
  };
  users[id] = newUser;
  return id;
};

const generateRandomString = () => {
  let result = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

module.exports = { findUserByEmail, urlsForUser, addUser, generateRandomString, users, urlDatabase };