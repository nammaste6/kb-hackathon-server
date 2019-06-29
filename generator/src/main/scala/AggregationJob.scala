import org.apache.spark.{SparkConf}
import org.apache.spark.sql.{SQLContext, SparkSession}

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
      .coalesce(1)
      .write
      .json("file:///Users/kaylee/Downloads/pay_sum")
  }
}
