var localstragtegy = require('passport-local').Strategy;


var mysql = require('mysql');

var bcrypt = require('bcrypt-nodejs');

var dbConfig = require('./config');
// 
var connection = mysql.createConnection(dbConfig.connect);
// 
connection.query('USE ' + dbConfig.database);


module.exports = function(passport) {
    
    
     // used to serialize the user for the session
    passport.serializeUser(function(user, done) { // hàm này đc gọi khi xác thực t/công và ghi gt user vào ss
        done(null, user.id);  // ????
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {   //Thông tin đã lưu đại diện cho người dùng được lấy ra trong các request lần sau
        connection.query("SELECT * FROM users WHERE id = ? ",[id], function(err, rows){
            done(err, rows[0]);  //???
        });
    });




     // =====================
    // LOCAL SIGNUP =========
    // ======================
   
    passport.use(
        'local-register',
        
        new localstragtegy({
            //????? không hiểu tại sao lại khởi tạo ntn
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true 
        },
        function(req, username, password, done) {
            console.log("check_username")
            // kiểm tra xem username đã được tạo trước đó chưa
            //?????? k hiểu các phần return, cú pháp, cái gì sẽ nhận phần return đó, và sẽ hiểu như thế nào khi nhận từng return khác nhau phía dưới đây
            connection.query("SELECT * FROM users WHERE username = ?",[username], function(err, rows) {
                if (err)
                    return done(err);
                if (rows.length) {
                    return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
                } else {
                    // username chưa được tạo trước đó. Tạo mới registered info trong mysql
                    var newUserMysql = {
                        username: username,
                        password: bcrypt.hashSync(password, null, null) // mã hóa password
                    };
                    

                    // add infor vô database
                    console.log("add infor");
                    var insertQuery = "INSERT users (username, password ) values (?,?)";
                    connection.query(insertQuery,[newUserMysql.username, newUserMysql.password],function(err, rows) {
                        newUserMysql.id = rows.insertId;
                        return done(null, newUserMysql);
                    });
                }
            });
        })
    );

    // ===================
    // LOCAL LOGIN =======
    // ===================
  
    passport.use(
      'local-login',
      new localstragtegy({
          // ??? chưa hiểu khúc này có ý nghĩa gì???
          usernameField : 'username',
          passwordField : 'password',
          passReqToCallback : true 
      },
      function(req, username, password, done) { // callback với username và password đã điền để kiểm tra trong database
        console.log("check_login")
        // kiểm tra có tồn tại username trong database k
        connection.query("SELECT * FROM users WHERE username = ?",[username], function(err, rows){
              if (err)
                  return done(err);
              if (!rows.length) {
                  return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
              }

              // ?????? kiểm tra password ( nhưng chưa hiểu cú pháp này)
              if (!bcrypt.compareSync(password, rows[0].password))
                  return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

              // hoàn tất
              return done(null, rows[0]);
          });
      })
  );
};





