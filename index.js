require('babel-register');
var express = require('express');
var app = express();
app.set('json spaces', 2);
var Sequelize = require('sequelize');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt');
var secureRandom = require('secure-random');
var cookieParser = require('cookie-parser');
var ReactDOMServer = require('react-dom/server');
/*function renderHtml(jsxStructure) {
  var outputHtml = ReactDOMServer.renderToStaticMarkup(jsxStructure);

  return '<!doctype html>' + outputHtml;
}*/
var render= require("./rendering.jsx");

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
function checkLoginToken(request, response, next) {

  if (request.cookies.SESSION) {
    // console.log(request.loggedInUser);
    Session.findOne({
      where: {
        token: request.cookies.SESSION
      },
      include: User // so we can add it to the request
    }).then(
      function(session) {
        // session will be null if no token was found
        if (session) {
          // console.log(session.user.loggedInUser);
          request.loggedInUser = session.user;
        }

        // No matter what, we call `next()` to move on to the next handler
        next();
      }
    )
} else {
   next(); 
  }
}
app.use(checkLoginToken);
function checkCurrentPage (req,res,next) {
  // console.log(req);
  next();
}
app.use(checkCurrentPage);

app.use("/files", express.static('files'));  //the directory that *this file* will serve

var db = new Sequelize('db','heynah', '', {dialect: 'mysql'});
//var connction ->
/*var connection = mysql.createConnection({
  host     : process.env.IP,
  user     : process.env.C9_USER,
  password : '',
  database : 'db'
});

connection.query("SELECT Account.id, AddressBook.accountId, Account.email, AddressBook.name FROM Account LEFT JOIN AddressBook on Account.id=AddressBook.accountId", 
function(err, rows){
} */

var User = db.define('user', {
    username: {
        type:Sequelize.STRING, unique: 'compositeIndex',
        validate: {len: [3,40]}},
    hashed_password: Sequelize.STRING,
    password: {
        type: Sequelize.VIRTUAL,
        set: function(actualPassword) {
            this.setDataValue('hashed_password', bcrypt.hashSync(actualPassword, 10));
        },
        validate: {len: [6,40]} //try&catch to throw an exeption with message if it doesn't validate
    }
});
var Post = db.define('content', {
    url: Sequelize.STRING,
    title: Sequelize.STRING
});
var Vote = db.define('vote', {
    upVote: Sequelize.INTEGER
});
var Session = db.define('session', {
    token: Sequelize.STRING
});

User.hasMany(Session); // This will let us do user.createSession
Session.belongsTo(User); // This will let us do Session.findOne({include: User})

Post.belongsTo(User); 
User.hasMany(Post);

User.belongsToMany(Post, {through: Vote, as: "Upvotes"});
Post.belongsToMany(User, {through: Vote});

Post.hasMany(Vote); // New association, new sync (1 time)

function createSessionToken() {
    return secureRandom.randomArray(40).map(code => code.toString(16)).join('');
}

//***GET
app.get('/hello', function (req, res) {
  res.send("<h1>Hello, you handsom devil, you!</h1>");
});
//response.status ->
/*app.get('/op/:operation/:number1/:number2', function (request, response) {
  total ? response.json({"Operation": operator, "First number" : number1, "Second number": number2, "Solution" : total}) 
  : response.status(400).json({error: "Wrong, Buddy! Keep trying (enter an operation 'add', 'sub', 'mult', or 'div' and 2 numbers)."});
});*/


app.get('/', function(req, res) {
  console.log(req.loggedInUser);
  Post.findAll({
    include: [{model: Vote, attributes: []}, {model: User}],
    group: 'content.id',
    attributes: {
        include: [
            [Sequelize.fn('SUM', Sequelize.col('votes.upVote')), 'voteScore']
        ]
    },
    order: [Sequelize.literal('voteScore DESC')],
    limit: 25, // this can be hard-coded to 25, and eventually in a later phase parameterized
    subQuery: false 
}).then(function (posts) {
 
    res.send(render.renderHomepage({user: req.loggedInUser, posts: posts, error: req.query.error})) //decode url
})
});

app.get('/joinUs', function(req, res) {
    if (req.loggedInUser) {
    res.redirect('/?error=You remain logged in ;)');
    return;
  }
    res.send(render.renderSignUp({error:req.query.error}));
});

app.get('/login', function(req, res) {
  if (req.loggedInUser) {
    res.redirect('/?error=You remain logged in ;)');
    return;
  }
  res.send(render.renderLogin({user: req.loggedInUser, error:req.query.error}));
  
}); 

app.get('/postSomething', function(req, res, next) {
  // console.log(req);
  if (!req.loggedInUser) {
    res.redirect('/login?error=Login and make yourself known, Stanger.');
    return;
  }
    res.send(render.renderPost({user: req.loggedInUser, error:req.query.error})); 
    });
    
app.get('/bye', function(req, res) {
  if(req.loggedInUser) {
    Session.findOne( {
      where: {token : req.cookies.SESSION}
    }).then(function(userSession){
      return userSession.destroy()
      
    }).then(function() {
      res.clearCookie("SESSION")
      res.redirect('/?error=Log back in to exercise your democratic powers and share your special self with the Tidder world');
    })
  } else {
    res.redirect("/?error=You wern't even logged in, Dude! You must really want to get out to have found me");
  }
});


//***POST
app.post('/joinUs', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
//   res.send(req.body);
 
 User.findOne({
     where : {username: username}
 }).then(function(existingUser){
     if(!existingUser){
       var userName = username;
       if (userName.length<3){
         res.redirect('/joinUs?error= Username must have at least 3 characters, por favor.');
       } else if (password.length<6) {
         res.redirect("/joinUs?error= Choose a longer, stronger password s'il te plait.");
       } else {
        User.create({username: username, password: password}).then(function(){
        res.redirect('/');});
       }
     } else {
        res.redirect('/joinUs?error=*(  sad, you are not the first to the party. Try another username.');
        // res.send("<h2>*( sad, you are  not the first. Please register with another <a href='https://project-reddit-clone-heynah.c9users.io/joinUs'>username. </a></h2>")
     }
 })
});

app.post('/login', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
//   if (!req.body) return res.sendStatus(400);    
  User.findOne({
      where : {username: username}
  }).then(function(returningUser) {
      if(!returningUser){
          res.redirect('/login?error=Uh oh, bad username/password combo. Please try your login again');
          //res.send("<h2 style='color: maroon'>Uh oh, bad username/password combo. Please <a href='https://project-reddit-clone-heynah.c9users.io/login'>try again. </a></h2>");
      } else {
//check password with if else
        //   res.send(returningUser + password + returningUser.hashed_password);
          var isPasswordOk = bcrypt.compareSync(password, returningUser.hashed_password);
          if (isPasswordOk) {
            var token = createSessionToken();
            
            // res.send('password match');
            returningUser.createSession({
                token: token
                }).then(function(session) {
// Here we can set a cookie for the user!
                res.cookie('SESSION', token);
                res.redirect('/');  //**"error" that says bienvenue
                });
          } else {
              res.redirect('/login?error=Uh oh, bad username/password combo. Please try your login again');
              //res.send("<h2 style='color: maroon'>Uh oh, bad username/password combo. Please <a href='https://project-reddit-clone-heynah.c9users.io/login'>try again. </a></h2>");
          }
      }
  })

  //res.send('welcome, ' + req.body.username)
})

app.post('/postSomething', function(req, res) {
  console.log(req.session.user)
  var url = req.body.url;
  var title = req.body.title;
  if (!req.data.loggedInUser) {
      res.status(401).send("<a href='https://project-reddit-clone-heynah.c9users.io/login'>Make yourself known, Stanger. </a></h2>");
  } else {
      req.session.user.dataValues.createContent({
          title: title,
          url: url
      }).then(
          function(content){
            console.log(content)
            res.redirect('/');
          })
    }
});

app.post('/votePost', function(req, res) {
  // res.send(req.body);
    if(req.loggedInUser){  //finds the user, then has all that junk (.id, blah blah blah)
      //findOne where userId: req.loggedInUser, contentId: body.contentId
      //then fun on vote => add a vote (votes.create, with userId, contentId, upVote)
      //upVote: (req.body.upVote === 'true' ? 1 : -1)
      Vote.findOne({
        where: { 
          userId: req.loggedInUser.id,
          contentId: req.body.contentId
        }
      }).then(
        function(vote){
          if (!vote) {
            return Vote.create({
              userId: req.loggedInUser.id,
              contentId: req.body.contentId,
              upVote: (req.body.upVote === 'true' ? 1 : -1)
            });
          } else { 
            //res.send(req.body);
            return vote.update({    //because it's inside the function, vote refers to the already selected "Vote"
              upVote: (req.body.upVote === 'true' ? 1 : -1)
            });
          }
    }
  ).then(

    function(vote) {
      
        res.redirect('/');
    }
  );
          } else {
          res.redirect('/?error=Log in to vote, Robot!');  
          }
        }
);

// First check if a vote already exists
/*Vote.findOne({
    where: {
      userId: 1, // This should be the currently logged in user's ID
      contentId: 1 // This should be the ID of the content we want to vote on
    }
}).then(
    function(vote) {
        if (!vote) {
            // here we didn't find a vote so let's add one. Notice Vote with capital V, the model
            return Vote.create({
                userId: 1, // Received from the loggedIn middleware
                contentId: 1, // Received from the user's form submit
                upVote: true // Received from the user's form submit
            });
        }
        else {
            // user already voted, perhaps we need to change the direction of the vote?
            return vote.update({
                upVote: true // Received from the user's form submit
            });
        }
    }
).then(
    // Look at the two returns in the previous callbacks. In both cases we are returning
    // a promise, one to create a vote and one to update a vote. Either way we get the result here
    function(vote) {
        // Good to go, the user was able to vote. Let's redirect them to the homepage?
        res.redirect('/');

        // Perhaps we could redirect them to where they came from?
        // Try to figure out how to do this using the Referer HTTP header :)
    }
);
*/










/*User.create({
  username: 'john-doe',
  password: generatePasswordHash('i-am-so-great')
}).then(function(user) {
  /* ... */
/*})*/
/*var url
var title
create content {url: req.body.url})*/

/*app.use(bodyParser.json())

app.use(function (req, res) {
  res.setHeader('Content-Type', 'text/plain')
  res.write('you posted:\n')
  res.end(JSON.stringify(req.body, null, 2))
})*/


/*express route-specific

This example demonstrates adding body parsers specifically to the routes that need them. In general, this is the most recommend way to use body-parser with express.

// create application/json parser


// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

// POST /login gets urlencoded bodies
app.post('/login', urlencodedParser, function (req, res) {
  if (!req.body) return res.sendStatus(400)
  res.send('welcome, ' + req.body.username)
})

// POST /api/users gets JSON bodies
app.post('/api/users', jsonParser, function (req, res) {
  if (!req.body) return res.sendStatus(400)
  // create user in req.body
})*/

db.sync(/*{force:true}*/);

/* START SERVER */

var server = app.listen(process.env.PORT, process.env.IP, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
