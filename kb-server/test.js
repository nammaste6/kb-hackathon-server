var exec = require("child_process").exec;

var jar_file = '/Users/kaylee/jsproj/kb-hackathon-server/generator/target/scala-2.11/generator_2.11-0.1.jar';
var spark_submit_cmd = `spark-submit --deploy-mode cluster --master yarn --deploy-mode cluster --driver-memory 4g --executor-memory 2g --executor-cores 2 --class ImportActlogToS3 ${jar_file}`

console.log(spark_submit_cmd);
exec("ls -al /Users/kaylee/jsproj/kb-hackathon-server/kb-server", function(err, stdout, stderr) {
  console.log(stdout);
});
