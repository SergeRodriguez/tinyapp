const express = require("express");
const { findUserByEmail, urlsForUser, addUser, generateRandomString, users, urlDatabase } = require("./helpers")
const bcrypt = require('bcrypt');
const cookieSession = require('cookie-session');
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.use(
  cookieSession({
    name: 'session',
    keys: [
      '7de13381-61b5-47aa-9c74-5ede1ceac390',
      '8dddb6db-4d8d-4571-a836-04fa8d5a9186',
    ],
  }),
);

app.get("/", (req, res) => {
  if (req.session.user_id) {
    res.redirect("/urls")
  }
  else {
    res.redirect("/login")
  }
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
  const userUrls = urlsForUser(req.session.user_id)
  let templateVars = {
    urls: userUrls,
    user: users[req.session.user_id]
  };

  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  let templateVars = {
    user: users[req.session.user_id]
  };
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  if (!urlDatabase[req.params.shortURL]) {
    res.status(404).send("The short URL cannot be located.")
    return;
  }
  if (req.session.user_id !== urlDatabase[req.params.shortURL].userID) {
    res.status(404).send("The short URL cannot be located.")
    return;
  }
  let templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL,
    user: users[req.session.user_id]
  };
  res.render("urls_show", templateVars)
})

app.get("/u/:shortURL", (req, res) => {
  if (!urlDatabase[req.params.shortURL]) {
    res.status(404).send("The short URL cannot be located.")
    return;
  }
  const longURL = urlDatabase[req.params.shortURL].longURL
  res.redirect(longURL);
});

app.get("/register", (req, res) => {
  let templateVars = {
    user: users[req.session.user_id]
  };
  res.render("urls_register", templateVars)
})

app.get("/login", (req, res) => {
  let templateVars = {
    user: users[req.session.user_id]
  };
  res.render("urls_login", templateVars)
})

app.post("/urls", (req, res) => {
  shortURL = generateRandomString()
  urlDatabase[shortURL] = {
    longURL: req.body.longURL,
    userID: req.session.user_id
  }
  res.redirect(`/urls/${shortURL}`);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  if (!urlDatabase[req.params.shortURL]) {
    res.status(404).send("The short URL cannot be located.")
    return;
  }
  if (req.session.user_id !== urlDatabase[req.params.shortURL].userID) {
    res.status(404).send("The short URL cannot be located.")
    return;
  }
  delete urlDatabase[req.params.shortURL]
  res.redirect("/urls")
})

app.post("/urls/:shortURL/edit", (req, res) => {
  if (!urlDatabase[req.params.shortURL]) {
    res.status(404).send("The short URL cannot be located.")
    return;
  }
  if (req.session.user_id !== urlDatabase[req.params.shortURL].userID) {
    res.status(404).send("The short URL cannot be located in your account")
    return;
  }
  urlDatabase[req.params.shortURL].longURL = req.body.longURL;

  res.redirect("/urls")
})

app.post("/logout", (req, res) => {
  req.session = null
  res.redirect("/urls")
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!findUserByEmail(email, users)) {
    res.status(403).send("The email you entered is not valid");
    return;
  }

  if (!bcrypt.compareSync(password, findUserByEmail(email, users).password)) {
    res.status(403).send("You did not enter the correct password. Please retry");
    return;
  }

  req.session.user_id = findUserByEmail(email, users).id;// res.cookie("user_id", findUserByEmail(email, users).id)
  res.redirect("/urls")
});

app.post("/register", (req, res) => {
  const { email, password } = req.body;

  if (email === "" || password === "") {
    res.status(401).send('You forgot to enter your email/password!');
    return;
  }

  if (findUserByEmail(email, users)) {
    res.status(401).send("The email you entered already exists in our database");
    return;
  }
  const hashedPassword = bcrypt.hashSync(password, 10);
  const id = generateRandomString()
  addUser(email, hashedPassword, id)
  req.session.user_id = id;  //res.cookie("user_id", id)
  res.redirect("/urls")

})


app.get('/db/users', (req, res) => {
  res.json(users);
});

app.get('/db/url', (req, res) => {
  res.json(urlDatabase);
});