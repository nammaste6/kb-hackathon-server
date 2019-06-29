var express = require('express');
var router = express.Router();
var db_con = require('../db/db_con')();

router.get('/signup', function(req, res, next) {
  // 화면 
  res.send('signup page');
});

router.get('/signin', function(req, res, next) {
  // 화면 
  res.send('signin page');
});

var connection = db_con.init();

router.get('/signup/data', function(req, res, next) {
  var email = req.query.email;
  var password = req.query.password;

  var stmt = `INSERT INTO person (id, password) VALUES ("${email}", "${password}")`;

  connection.query(stmt, function (err, result) {
    if(!err) {
      //회원 가입 완료
      res.send('home page');
    }
  });
});

router.get('/signin/data', function(req, res, next) {
  var email = req.query.email;
  var password = req.query.password;

  var stmt = `SELECT * FROM person WHERE id = "${email}" AND password = "${password}"`;

  connection.query(stmt, function (err, result) {
    if(!err) {
      res.send('home page');
    } else {
      res.send('login failed !!!');
    }
  });
});

router.get('/favor', function(req, res, next) {
  // 사용자 mbti 및 사용자 찾는 page
  res.send('favor page');
});

router.get('/favor/data', function(req, res, next) { 
  var uno = req.query.uno;
  var is_lessor = req.query.is_lessor;
  var u_mbti = req.query.u_mbti;
  var favor_place_category = req.query.favor_place_category;
  var favor_subway = req.query.favor_subway;
  var favor_price_low = req.query.favor_price_low;
  var favor_price_high = req.query.favor_price_high;
  var favor_price_method = req.query.favor_price_method;
  var job_category = req.query.job_category;

  var stmt = `INSERT INTO person_info (uno, is_lessor, u_mbti, favor_place_category, favor_subway, favor_price_low, favor_price_high, favor_price_method, job_category) VALUES (${uno}, ${is_lessor}, "${u_mbti}", ${favor_place_category}, "${favor_subway}", ${favor_price_low}, ${favor_price_high}, ${favor_price_method}, ${job_category})`;
  connection.query(stmt, function (err, result) {
    if(!err) {
      res.send('home page');
    } else {
      console.log(err)
      res.send('failed !!!');
    }
  });
});

module.exports = router;
