import java.io.File
import java.nio.charset.Charset

import com.google.gson.Gson
import org.apache.commons.io.FileUtils

case class Mbti (uno: Int, no_1: Int, no_2: Int, no_3: Int, no_4: Int, no_5: Int, no_6: Int, no_7: Int, no_8: Int, no_9: Int, no_10: Int, no_11: Int, no_12: Int, no_13: Int, no_14: Int, no_15: Int)

object GenerateMbtiJson {
  def main(args: Array[String]): Unit = {
    val rd = scala.util.Random;
    val gson = new Gson

    var sb = new StringBuilder

    //val unoList = Array(0, 1, 2, 3, 4, 5)

    for(i <- 1 to 10) {
      var str = gson.toJson(new Mbti(
        i,
        rd.nextInt(4),
        rd.nextInt(4),
        rd.nextInt(4),
        rd.nextInt(4),
        rd.nextInt(4),
        rd.nextInt(4),
        rd.nextInt(4),
        rd.nextInt(4),
        rd.nextInt(4),
        rd.nextInt(4),
        rd.nextInt(4),
        rd.nextInt(4),
        rd.nextInt(4),
        rd.nextInt(4),
        rd.nextInt(4)
      ))

      sb.append(str + "\n");
    }

    FileUtils.writeStringToFile(new File("/Users/kaylee/Downloads/mbti.json"), sb.toString(), Charset.forName("UTF-8"))
  }
}
