import java.io.File
import java.nio.charset.Charset

import com.google.gson.Gson
import org.apache.commons.io.FileUtils

case class Category (uno: Int, shopping: Int, beauty: Int, transport: Int, food: Int, edu: Int, health: Int, culture: Int, utility: Int, family: Int, etc: Int)

object GeneratePayJson {

  def main(args: Array[String]): Unit = {

    //val uno = Integer.valueOf(args(0))
    val uno = 1;
    val rd = scala.util.Random
    val gson = new Gson

    var sb = new StringBuilder

    for(i <- 0 to 100) {
      var str = gson.toJson(new Category(
        uno,
        rd.nextInt(10000),
        rd.nextInt(50000),
        rd.nextInt(50000),
        rd.nextInt(10000),
        rd.nextInt(10000),
        rd.nextInt(30000),
        rd.nextInt(10000),
        rd.nextInt(10000),
        rd.nextInt(10000),
        rd.nextInt(10000)
      ))

      sb.append(str + "\n");
    }

    FileUtils.writeStringToFile(new File("/Users/kaylee/Downloads/pay.json"), sb.toString(), Charset.forName("UTF-8"))
  }
}
