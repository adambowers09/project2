const router = require('express').Router();
const multer  = require('multer')
const upload = multer({ dest: '../data/uploads/' })
const fs = require('fs');
const path = require('path')


module.exports = (db) => {
  // Load register page
  router.get('/register', (req, res) => {
    if (req.isAuthenticated()) {
      res.redirect('/profile');
    } else {
      res.render('register');
    }
  });

  // Load profile page
  router.get('/profile', (req, res) => {
    if (req.isAuthenticated()) {
      db.User.findOne({
        where: {
          id: req.session.passport.user.id
        }
      }).then(() => {
        const user = {
          userInfo: req.session.passport.user,
          isloggedin: req.isAuthenticated()
        };
        // console.log(user);
        res.render('profile', user);
      });
    } else {
      res.redirect('/');
    }
  });

  // Load dashboard page
  router.get('/', (req, res) => {
    if (req.isAuthenticated()) {
      const user = {
        user: req.session.passport.user,
        isloggedin: req.isAuthenticated()
      };
      res.render('dashboard', user);
    } else {
      res.render('dashboard');
    }
  });

  // Load dashboard page
  router.get('/dashboard', (req, res) => {
    if (req.isAuthenticated()) {
      const user = {
        user: req.session.passport.user,
        isloggedin: req.isAuthenticated()
      };
      res.render('dashboard', user);
    } else {
      res.render('dashboard');
    }
  });

  // Load example index page
  router.get('/example', function (req, res) {
    if (req.isAuthenticated()) {
      db.Example.findAll({ where: { UserId: req.session.passport.user.id }, raw: true }).then(function (dbExamples) {
        res.render('example', {
          userInfo: req.session.passport.user,
          isloggedin: req.isAuthenticated(),
          msg: 'Welcome!',
          examples: dbExamples
        });
      });
    } else {
      res.redirect('/');
    }
  });

  // Load example page and pass in an example by id
  router.get('/example/:id', function (req, res) {
    if (req.isAuthenticated()) {
      db.Example.findOne({ where: { id: req.params.id }, raw: true }).then(function (dbExample) {
        res.render('example-detail', {
          userInfo: req.session.passport.user,
          isloggedin: req.isAuthenticated(),
          example: dbExample
        });
      });
    } else {
      res.redirect('/');
    }
  });


  // router.post('/single', upload.single('image'), (req, res) => {
  //   console.log(req.file);
  //   res.send({
  //     status: "succes",
  //     message: "File uploaded sccessfully",
  //     data: req.file,
  //   });
  // });

  // router.post('/multiple', upload.array('images', 12), (req, res, next) => {
  //   // req.files is array of `photos` files
  //   // req.body will contain the text fields, if there were any
  //   console.log(req.files);
  //   res.send({
  //     status: "succes",
  //     message: "Files uploaded sccessfully",
  //     data: req.files,
  //   });
  // });

  router.get('/single', (req, res) => {
    res.render("index")
    // const options = {
    //   root: path.join(__dirname, '../data/uploads')
    });

  // router.post('/uploadfile', uploadMultiple, function (req, res, next) {
  //   if(req.files){
  //     console.log(req.files)
  //     console.log("files uploaded")
  //     }
      

  //   })
  
  
// res.sendFile(req.body, options, (err) => {
//       if (err) next(err);
//       else console.log('Sent:', fileName);
//     });
//   });
//     console.log(req.file)
//     res.file(image);
 
  // router.get('/multiple', (req, res) => {
  //   res.sender("index2")
  // });

  


 

  // Logout
  router.get('/logout', (req, res, next) => {
    req.logout();
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      }
      res.clearCookie('connect.sid', { path: '/' });
      res.redirect('/');
    });
  });

  // Render 404 page for any unmatched routes
  router.get('*', function (req, res) {
    res.render('404');
  });

  return router;
};
