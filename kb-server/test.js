var test = "1234k"
var str = `"${test}" is ES6` + ` asdf`

var uno = 1;

var stmt2 = `SELECT` +
    `  *, ` +
    `  (w_rate * 10) as percent` +
    `FROM PLACE p` +
    `INNER JOIN (` +
    `  SELECT pi.*, w_rate` +
    `  FROM person_info pi` +
    `  INNER JOIN (` +
    `    SELECT mm.o_mbti, IF(count(mm.o_mbti) <= 1, avg(mm.rate), ((count(mm.o_mbti) / 10) + 1) * avg(mm.rate)) AS w_rate` +
    `    FROM mbti_ml mm` +
    `    INNER JOIN person_info pi` +
    `      ON (pi.u_mbti = mm.s_mbti or pi.pay_mbti = mm.s_mbti) AND pi.uno = ${uno}` +
    `    GROUP BY mm.o_mbti` +
    `  ) AS recm` +
    `  ON pi.pay_mbti = recm.o_mbti` +
    `  WHERE pi.uno != ${uno}` +
    `    AND pi.is_lessor = 0` +
    `) AS rep` +
    `ON p.uno = rep.uno`;

console.log(stmt2);
