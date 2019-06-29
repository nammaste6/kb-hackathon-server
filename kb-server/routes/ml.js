var express = require('express');
var router = express.Router();

var fs = require('fs');
var readline = require('readline');
var async = require('async');

const {Bayes, sample, CF, evaluation} = require('nodeml');

var db_con = require('../db/db_con')();

var connection = db_con.init();

function loadingModel(path) {

}

router.get('/learn/mbti', function(req, res, next) {

  fs.readFile('/Users/kaylee/jsproj/kb-hackathon-server/kb-server/models/bayes.json', function() {

    console.log("####### LOAD MBTI DATA ML MODEL #######");

    let cf = new CF();

    // d format
    // ENTP,INTP,4.3
    var s_mbti = req.query.s_mbti;
    var mbti = elem[0];
    var feature = {'source_mbti': elem[0], 'target_mbti': elem[1], 'rate': elem[2]};

    var list = [];
    list.push(feature);

    console.log('ADD FEATURE ' + JSON.stringify(feature));
    cf.train(list, 'source_mbti', 'target_mbti', 'rate');

    let model = cf.getModel();

    console.log("####### UPDATE MBTI DATA ML MODEL #######");
    fs.writeFile("/Users/kaylee/jsproj/kb-hackathon-server/kb-server/models/cf.json", JSON.stringify(model), function(err) {});
      if(!err) {
        req.send({'success', true});
      }
  });

});

router.get('/learn/pay', function(req, res, next) {

  fs.readFile('/Users/kaylee/jsproj/kb-hackathon-server/kb-server/models/bayes.json', function() {

    console.log("####### LOAD PAY DATA ML MODEL #######");

    let bayes = new Bayes();

    // d format
    // {"shopping": 0.5, "beauty": 0.3, "edu": 0.1}
    var s_mbti = req.query.s_mbti;
    var feature = JSON.parse(req.query.d);

    console.log('ADD FEATURE ' + JSON.stringify(feature));
    bayes.train(feature, s_mbti);

    let model = bayes.getModel();

    console.log("####### UPDATE PAY DATA ML MODEL #######");
    fs.writeFile("/Users/kaylee/jsproj/kb-hackathon-server/kb-server/models/bayes.json", JSON.stringify(model), function(err) { 
      if(!err) {
        req.send({'success', true});
      }
    });

  });

});

router.get('/recommend', function(req, res, next) {
  var uno = req.query.uno;

  var stmt = `SELECT * FROM person_info WHERE uno = ${uno}`;

  connection.query(stmt, function(err, result) {
    console.log(err)
    var person = result[0];

    var stmt2 = `SELECT` +
    `  *, ` +
    `  (w_rate * 10) as percent ` +
    `FROM PLACE p ` +
    `INNER JOIN ( ` +
    `  SELECT pi.*, w_rate` +
    `  FROM person_info pi` +
    `  INNER JOIN (` +
    `    SELECT mm.o_mbti, IF(count(mm.o_mbti) <= 1, avg(mm.rate), ((count(mm.o_mbti) / 10) + 1) * avg(mm.rate)) AS w_rate` +
    `    FROM mbti_ml mm` +
    `    INNER JOIN person_info pi` +
    `      ON (pi.u_mbti = mm.s_mbti or pi.pay_mbti = mm.s_mbti) AND pi.uno = 1` +
    `    GROUP BY mm.o_mbti` +
    `  ) AS recm` +
    `  ON pi.pay_mbti = recm.o_mbti` +
    //본인제외
    `  WHERE pi.uno != 1 ` +
    //임대인
    `    AND pi.is_lessor = 0 ` +
    `) AS rep ` +
    `ON p.uno = rep.uno`;


    var favor_subway = person.favor_subway;
    var favor_price_method = person.favor_price_method;
    var favor_price_low = person.favor_price_low;
    var favor_price_high = person.favor_price_high;

    connection.query(stmt2, function(err, result) {
      if(result) {
        for(idx in result) {
          var obj = result[idx];
          var s_rate = 0;
          if ( favor_subway == obj.subway_1 || favor_subway == obj.subway_2 || favor_subway == obj.subway_3 ) {
            console.log("###### SUBWAY MATCHING ADD WEIGHT 0.2")
            s_rate = obj.w_rate * 0.2;
          }

          if ( favor_price_method == obj.price_method ) {
            console.log("###### PRICE CATEGORY MATCHING ADD WEIGHT 0.1")
            s_rate += obj.w_rate * 0.1;
          }

          if ( obj.price >= favor_price_low && obj.price <= favor_price_high ) {
            console.log("###### PRICE MATCHING ADD WEIGHT 0.1")
            s_rate += obj.w_rate * 0.1;
          }
          
          console.log("###### ADD TOTAL WEIGHT is " + s_rate + " TO PLACE NAME is " + obj.place_name);
          obj['f_rate'] = obj.w_rate + s_rate;
          obj['percent'] = obj.f_rate * 10;
        }
        res.send(result);
      }
    });
  });
});

module.exports = router;
