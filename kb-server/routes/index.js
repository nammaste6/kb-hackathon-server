var express = require('express');
var router = express.Router();
var async = require('async');
var http = require('http');

var db_con = require('../db/db_con')();

var connection = db_con.init();

var headers = [];

var options = {
  url : 'localhost',
  port : 3000,
  path : '/test_api/get/creditRate',
  method:'GET',
  headers: headers,
  qs: {'apiKey': '201501195EQW98965','year':'2014','term':'A10','subjectDiv':'""'}
};

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// 잔액조회
router.get('/get/balance', function(req, res, next) {
  async.waterfall([
    function( cb ) {
      options.path = '/test_api/get/getAccountBalance';

      http.request(options, function(response) {
        var serverData = '';
        response.on('data', function (chunk) {
          serverData += chunk;
        });
        response.on('end', function () {
          console.log(serverData);
          cb(null, serverData);
        });
      }).end();
    },
    function( serverData, cb ) {
      var temp = JSON.parse(serverData); 
      var result = {};

      result['name'] = temp['dataBody']['고객명'];
      result['balance'] = temp['dataBody']['계좌출금가능금액'];

      res.setHeader('Content-Type', 'application/json');
      res.send(result);
    }
  ], function() {});
});

// 소비데이터
router.get('/get/pay', function(req, res, next) {
  var uno = req.query.uno;

  var stmt = `SELECT uno, pay_mbti, pay_tendency FROM person_info where uno = ${uno}`;

  connection.query(stmt, function(err, result) {
    if(!err) {
      res.send(result);
    }
  });
});

//나의 신용등급
router.get('/get/credit_rating', function(req, res, next) {
  async.waterfall([
    function( cb ) {

      options.path = '/test_api/get/creditRate';

      http.request(options, function(response) {
        var serverData = '';
        response.on('data', function (chunk) {
          serverData += chunk;
        });
        response.on('end', function () {
          console.log(serverData);
          cb(null, serverData);
        });
      }).end();
    },
    function( serverData, cb ) {
      var result = JSON.parse(serverData); 
      res.setHeader('Content-Type', 'application/json');
      res.send(result);
    }
  ], function() {});

});

// mbti description
router.get('/get/mbti_desc', function(req, res, next) {
  var uno = req.query.uno;

  var stmt = `select md.* `+
    `from mbti_desc md `+
    `inner join person_info pi `+
    `  on md.mbti = pi.u_mbti `+
    `where pi.uno = ${uno}`;

  connection.query(stmt, function (err, result) {
    if(!err) {
      res.send(result[0]);
    }
  });

});

router.get('/get/product', function(req, res, next) {
  var uno = req.query.uno;

  var order_fields = "prod_id,prod_category,prod_name,favor_job_category,price_str,url".split(",");
  var order_methods = ["desc", "asc"];

  var order_field_idx = Math.floor(Math.random() * order_fields.length);
  var order_field = order_fields[order_field_idx];

  var order_method_idx = Math.floor(Math.random() * order_methods.length);
  var order_method = order_methods[order_method_idx];

  var stmt = `SELECT pd.* FROM product pd ` + 
    `INNER JOIN person_info pi ` + 
    `ON pi.job_category = pd.favor_job_category ` + 
    `WHERE pi.uno = ${uno} ` + 
    `ORDER BY ${order_field} ${order_method}`;

  connection.query(stmt, function(err, result) {

    var resList = [];

    var rentIdx = 2;
    var saveIdx = 1;

    for( idx in result ) {
      var prod = result[idx];
      if(prod.prod_category == 0) { //대출일경우 2개 추천
        if(rentIdx > 0) {
          resList.push(prod);
          rentIdx -=1;
        }
      } else {
        if(saveIdx > 0) {
          resList.push(prod);
          saveIdx -=1;
        }
      }
    }

    res.send(resList);
  });

});

module.exports = router;
