
const express = require('express');
const app = express();
const static = express.static(__dirname + '/public');
const configRoutes = require('./routes');
const exphbs = require('express-handlebars');
const session = require('express-session');

const handlebarsInstance = exphbs.create({
    defaultLayout: 'main',
    // Specify helpers which are only registered on this instance.
    helpers: {
      asJSON: (obj, spacing) => {
        if (typeof spacing === 'number')
          return new Handlebars.SafeString(JSON.stringify(obj, null, spacing));
  
        return new Handlebars.SafeString(JSON.stringify(obj));
      }
    },
    partialsDir: ['views/partials/']
  });

app.use('/public', static);
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.engine('handlebars', handlebarsInstance.engine);
app.set('view engine', 'handlebars');

app.use(
  session({
    name: "AuthCookie",
    secret: "some secret string!",
    saveUninitialized: true,
    resave: false,
  })
);

app.use(async (req, res, next) => {
  const utcDate = new Date().toUTCString();
  const method = req.method;
  const url = req.originalUrl;
  let isAuth = "Authenticated User";
  if (!req.session.user) {
    isAuth = "Non-Authenticated User";
  }
  console.log(`${utcDate}: ${method} ${url} (${isAuth})`);
  next();
});

app.use('/private', (req, res, next) => {
  if (!req.session.user) {
    return res.status(403).render("error", {
      title: "Error",
      status: 403,
      msg: "You are not logged in."
    });
  } else {
    next();
  }
});

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});