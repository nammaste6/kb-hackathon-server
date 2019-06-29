import org.apache.spark.SparkConf
import org.apache.spark.sql.{SQLContext, SaveMode, SparkSession}
import org.apache.spark.sql.functions._


object AggregationJob {

  def main(args: Array[String]): Unit = {
   var conf = new SparkConf()
     .setMaster("local[*]")
     .setAppName("generate-json")

   var spark = SparkSession
     .builder()
     .config(conf)
     .getOrCreate()

   var sc = spark.sparkContext

   val sqlContext = new SQLContext(sc)
   import sqlContext.implicits._


   var test = sqlContext.read.format("json").load("file:///Users/kaylee/Downloads/pay.json")

   test
     .select("*")
     .createOrReplaceTempView("pay_history")

   var columnToSum = List(col("shopping"), col("beauty"), col("transport"), col("food"), col("edu"),
    col("health"), col("culture"), col("utility"), col("family"), col("etc"))

   //"shopping":7255,"beauty":69873,"transport":49838,"food":71759,"edu":28904,"health":10387,"culture":90966,"utility":91300,"family":1199,"etc":39522}
   spark.sql("select " +
       "uno, " +
       "sum(shopping) as shopping, " +
       "sum(beauty) as beauty,  " +
       "sum(transport) as transport,  " +
       "sum(food) as food,  " +
       "sum(edu) as edu,  " +
       "sum(health) as health,  " +
       "sum(culture) as culture,  " +
       "sum(utility) as utility,  " +
       "sum(family) as family,  " +
       "sum(etc) as etc  " +
       "from pay_history " +
       "group by uno")
    .withColumn("total", columnToSum.reduce( _ + _ ))
    .createOrReplaceTempView("agg_pay_history")

    spark
        .sql("select " +
          "uno," +
          "(shopping/total) as shopping, " +
          "(beauty/total) as beauty,  " +
          "(transport/total) as transport,  " +
          "(food/total) as food,  " +
          "(edu/total) as edu,  " +
          "(health/total) as health,  " +
          "(culture/total) as culture,  " +
          "(utility/total) as utility,  " +
          "(family/total) as family,  " +
          "(etc/total) as etc  " +
          "from agg_pay_history")
      .coalesce(1)
      .write
      .mode(SaveMode.Overwrite)
      .json("file:///Users/kaylee/Downloads/pay_sum")
  }
}
