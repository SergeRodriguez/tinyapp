const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
};

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
}

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
      urlsForCurrentUser[url] = urlDatabase[url]
    }
  }
  return urlsForCurrentUser;
}

const addUser = (email, password, id) => {
  const newUser = {
    id,
    email,
    password
  };
  users[id] = newUser;
  return id;
};

function generateRandomString() {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

module.exports = {findUserByEmail, urlsForUser, addUser, generateRandomString, users, urlDatabase}