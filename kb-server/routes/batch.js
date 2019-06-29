var express = require('express');
var router = express.Router();

var fs = require('fs');
var readline = require('readline');
var async = require('async');

const {Bayes, sample, CF, evaluation} = require('nodeml');

var db_con = require('../db/db_con')();

var connection = db_con.init();

router.get('/mbti', function(req, res, next) {

  console.log("####### MBTI DATA BATCH START #######");

  var lr = readline.createInterface({
    input : fs.createReadStream('/Users/kaylee/jsproj/kb-hackathon-server/kb-server/mbti_base.csv')
  })

  async.waterfall([
    function( cb ) {

      let dataList = {};
      let train = [], test = [];
      lr.on('line', function(line) {

        var elem = line.split(',');
        var feature = {'source_mbti': elem[0], 'target_mbti': elem[1], 'rate': elem[2]};
        console.log('ADD FEATURE ' + JSON.stringify(feature));

        if (Math.random() > 0.8) {
          test.push(feature);
        }
        else {
          train.push(feature);
        }
      })
      .on('close', function(){

        dataList.train = train;
        dataList.test = test;

        cb(null, dataList);

      });
    },
    function ( dataList, cb ) {
      console.log('train size : ' + dataList.train.length);
      console.log('test size : ' + dataList.test.length);

      const cf = new CF();

      cf.maxRelatedItem = 16;
      cf.maxRelatedUser = 16;

      cf.train(dataList.train, 'source_mbti', 'target_mbti', 'rate');

      let gt = cf.gt(dataList.test, 'source_mbti', 'target_mbti', 'rate');
      let result = cf.recommendGT(gt, 5);
      let ndcg = evaluation.ndcg(gt, result);

      for (s_mbti in result) {
        for (idx in result[s_mbti]) {
          var elem = result[s_mbti][idx];
          var o_mbti = elem.itemId;
          var rate = elem.score || (elem.play / 10);
      
          var stmt = `INSERT INTO mbti_ml (s_mbti, o_mbti, rate) VALUES ("${s_mbti}", "${o_mbti}", ${rate})`;
          connection.query(stmt, function(err, result) {
          });
        }
      }

      let model = cf.getModel();

      console.log("####### SAVE MBTI DATA ML MODEL #######");
      fs.writeFile("/Users/kaylee/jsproj/kb-hackathon-server/kb-server/models/cf.json", JSON.stringify(model), function(err) {});

      console.log("####### NDCG value : " + ndcg);
      res.send({'success': true});
    }
  ],
  function(err, obj){});
});


router.get('/pay', function(req, res, next) {

  console.log("####### PAY DATA BATCH START #######");

  var lr = readline.createInterface({
    input : fs.createReadStream('/Users/kaylee/jsproj/kb-hackathon-server/kb-server/pay_base.csv')
  })

  let bayes = new Bayes();

  async.waterfall([
    function(cb) {
      lr.on('line', function(line) {

        var elem = line.split(',');
        var mbti = elem[0];
        var feature = {};
        feature[elem[1]] = 0.53;
        feature[elem[2]] = 0.33;
        feature[elem[3]] = 0.14;

        console.log('ADD FEATURE ' + JSON.stringify(feature));
        bayes.train(feature, mbti);

        let model = bayes.getModel();

        console.log("####### SAVE PAY DATA ML MODEL #######");
        fs.writeFile("/Users/kaylee/jsproj/kb-hackathon-server/kb-server/models/bayes.json", JSON.stringify(model), function(err) {});
      })
      .on('close', function() {
        res.send({'success': true});
        cb(null);
      });
    }
  ], function() {});

});


module.exports = router;
