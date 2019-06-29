var express = require('express');
var router = express.Router();
var db_con = require('../db/db_con')();

var connection = db_con.init();

//신용조회 테스트 api
router.get('/get/creditRate', function(req, res, next) {
  var result = {};
  
  //기준 날짜
  result.standard_date = '2019.06.28';

  // 등급
  result.level = 2;

  // 신용 백분위
  result.credit_percentile='16.0';

  // 신용 평점 
  result.grade = 921;

  res.send(result);
});

// 잔액조회
router.get('/get/getAccountBalance', function(req, res, next) {

  res.send({
      "dataBody":{
        "신규일":"",
        "고객명":"김민경",
        "계좌잔액":"-419306",
        "만기일":"",
        "resCd":"0000",
        "계좌번호":"123456789",
        "계좌상품명":"",
        "계좌출금가능금액":"6487400"
      },
      "dataHeader":{
        "resultCode":"0000",
        "resultMessage":"서비스를 성공적으로 수행하였습니다.",
        "category":"API",
        "successCode":"0"
      }
  })
});

module.exports = router;
