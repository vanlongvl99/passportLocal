

// ?????????????????
// em chưa hiểu khúc nào khúc nào thông tin đăng ký của mình được lưu vào trong session và cookie
/// ????

odule.exports = function(app, passport) {
  
  
  // home page (trang chủ, server render file welcome đc lưu trong views)
  app.get('/', (req, res) => res.render('welcome'));

  // đường dẫn /users server render profile để hiển thị thông tin của user.
  app.get('/users', isLoggedIn, function(req, res) { // vào đường dẫn /users,
    // gọi hàm isLogged , nếu đang đăng nhập thì next render profile
		res.render('profile', {
			user : req.user // lấy user từ session đc được lưu vô từ phần register or login
		});
  });
  
  
  app.get('/users/login', function(req, res) {
    // xác thực client gửi yêu cầu tới có đang đăng nhập hay k?
    // nếu có thì dẫn đến /users
    if (req.isAuthenticated())
        res.redirect('/users');
    else
    res.render('login');

});


  // register page   
  app.get('/users/register', (req, res) => res.render('register'));

// process the login form
  app.post('/users/login', passport.authenticate('local-login', {
    //??????? khúc này vẫn còn thắc mắc cách thức chạy, trả về ntn, đặt tên successRedirect.... 
  successRedirect : '/users', // khi đăng nhập thành công sẽ dẫn đến đường dẫn /users nơi hiển thị info đã login
  failureRedirect : '/users/login', // khi bị lỗi sẽ back lại trang login ()
  failureFlash : true // ?????? code em khi login k được k thấy flash trả về no user found or wrong...
  }),function(req, res){
    // ??????? hàm này không hiểu
    if (req.body.remember) {
      req.session.cookie.maxAge = 1000 * 60 * 3;
    } else {
      req.session.cookie.expires = false;
    }
  });

// =====================================
    // register ==============================
    // =====================================
    // xác thực các thông tin đăng nhập 
  app.post('/users/register', passport.authenticate('local-register', {
      successRedirect : '/users', // giống trên
      failureRedirect : '/users/register', // giống trên 
      failureFlash : true // allow flash messages
  }));

  // ????? input next là gì??
  function isLoggedIn(req, res, next) {
  // xác thực người dùng có đang đăng nhập hay k?
    if (req.isAuthenticated())
      return next();
    res.redirect('/');
  }
}