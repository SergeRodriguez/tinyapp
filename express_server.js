const express = require("express");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
var cookieParser = require('cookie-parser');
app.use(cookieParser());
app.set("view engine", "ejs");

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

app.get("/", (req, res) => {
  res.send("Hello!");
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`)
})

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/set", (req, res) => {
  const a = 1;
  res.send(`a = ${a}`);
});

app.get("/fetch", (req, res) => {
  res.send(`a = ${a}`);
});

app.get("/urls", (req, res) => {
  urlsForUser(req.cookies["user_id"])
  let templateVars = {
    urls: urlDatabase,
    user: urlsForUser(req.cookies["user_id"])   //users[req.cookies["user_id"]]
  };

  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  let templateVars = {
    user: users[req.cookies["user_id"]]
  };
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL,
    user: users[req.cookies["user_id"]]
  };
  res.render("urls_show", templateVars)
})

app.get("/u/:shortURL", (req, res) => {
  // const longURL = ..
  const longURL = urlDatabase[req.params.shortURL].longURL
  res.redirect(longURL);
});

app.get("/register", (req, res) => {
  let templateVars = {
    user: users[req.cookies["user_id"]]
  };
  res.render("urls_register", templateVars)
})

app.get("/login", (req, res) => {
  let templateVars = {
    user: users[req.cookies["user_id"]]
  };
  res.render("urls_login", templateVars)
})

app.post("/urls", (req, res) => {
  shortURL = generateRandomString()
  urlDatabase[shortURL] = req.body.longURL
  res.redirect(`/urls/${shortURL}`);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL]
  res.redirect("/urls")
})

app.post("/urls/:shortURL/edit", (req, res) => {
  urlDatabase[req.params.shortURL] = req.body.longURL;
  console.log(req.body, req.header)
  res.redirect("/urls")
})

app.post("/logout", (req, res) => {
  res.clearCookie("user_id")
  res.redirect("/urls")
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  if(!findUser(email)){
    res.status(403).send("The email you entered is not valid");
    return;
  } 

  if(findUser(email).password !== password){
    res.status(403).send("You did not enter the correct password. Please retry");
    return;
  } 

  res.cookie("user_id", findUser(email).id)
  res.redirect("/urls")
});

app.post("/register", (req, res) => {
  const { email, password } = req.body;

  if (email === "" || password === "") {
    res.status(401).send('You forgot to enter your email/password!');
    return;
  }

  if (findUser(email)) {
    res.status(401).send("The email you entered already exists in our database");
    return;
  }

  const id = generateRandomString()
  addUser(email, password, id)
  res.cookie("user_id", id)
  res.redirect("/urls")

})

//returns the URLs where the userID is equal to the id of the currently logged in user.
const urlsForUser = id =>{
  const urlsForCurrentUser = {};
  for(let url in urlDatabase){  
    if (urlDatabase[url].userID === id){
      urlsForCurrentUser[url] = urlDatabase[url]
    }
  }
  return urlsForCurrentUser;
}


// We want to check if that email exists in users db
const findUser = email => {
  // itetrate through the users object
  for (let userId in users) {
    const currentUser = users[userId];
    if (currentUser.email === email) {
      return currentUser;
    }
  }
  return false;
};

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

app.get('/db/users', (req, res) => {
  res.json(users);
});

app.get('/db/url', (req, res) => {
  res.json(urlDatabase);
});