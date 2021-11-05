function googleTranslate(tabId, q, index, from, to) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", "http://translate.google.com/translate_a/single", true);
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var resp = JSON.parse(xmlhttp.responseText);
            var translateResult = resp[0];
            var result = [];
            for (var _i = 0, translateResult_1 = translateResult; _i < translateResult_1.length; _i++) {
                var e = translateResult_1[_i];
                var resultText = e[0];
                result.push(resultText.trim());
            }
            onSucceed(tabId, index, result);
        }
        else {
            return "请求失败";
        }
    };
    var tk = token(q);
    var urlValue = new URLSearchParams();
    urlValue.append("client", "webapp");
    urlValue.append("sl", from);
    urlValue.append("tl", to);
    urlValue.append("hl", "zh-CN");
    // urlValue.append("dt", "at") //备用翻译
    // urlValue.append("dt", "bd") //字典
    // urlValue.append("dt", "ex") //例子
    // urlValue.append("dt", "ld")
    // urlValue.append("dt", "md") //源文本的定义
    // urlValue.append("dt", "qca")
    // urlValue.append("dt", "rw") //清单
    // urlValue.append("dt", "rm") //音译
    // urlValue.append("dt", "sos")
    // urlValue.append("dt", "ss") //源文本同义词
    urlValue.append("dt", "t");
    urlValue.append("ie", "UTF-8"); //输入编码
    urlValue.append("oe", "UTF-8"); //输出编码
    urlValue.append("source", "bh");
    // urlValue.append("ssel", "0")
    // urlValue.append("tsel", "0")
    // urlValue.append("kc", "1")
    urlValue.append("tk", tk);
    urlValue.append("q", q);
    // xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
    xmlhttp.send(urlValue);
}
function token(a) {
    var k = "";
    var b = 406644;
    var b1 = 3293161072;
    var jd = ".";
    var sb = "+-a^+6";
    var Zb = "+-3^+b+-f";
    for (var e = [], f = 0, g = 0; g < a.length; g++) {
        var m = a.charCodeAt(g);
        128 > m ? e[f++] = m : (2048 > m ? e[f++] = m >> 6 | 192 : (55296 == (m & 64512) && g + 1 < a.length && 56320 == (a.charCodeAt(g + 1) & 64512) ? (m = 65536 + ((m & 1023) << 10) + (a.charCodeAt(++g) & 1023),
            e[f++] = m >> 18 | 240,
            e[f++] = m >> 12 & 63 | 128) : e[f++] = m >> 12 | 224,
            e[f++] = m >> 6 & 63 | 128),
            e[f++] = m & 63 | 128);
    }
    a = b;
    for (f = 0; f < e.length; f++)
        a += e[f],
            a = RL(a, sb);
    a = RL(a, Zb);
    a ^= b1 || 0;
    0 > a && (a = (a & 2147483647) + 2147483648);
    a %= 1E6;
    return a.toString() + jd + (a ^ b);
}
;
function RL(a, b) {
    var t = "a";
    var Yb = "+";
    for (var c = 0; c < b.length - 2; c += 3) {
        // @ts-ignore
        var d = b.charAt(c + 2), 
        // @ts-ignore
        d = d >= t ? d.charCodeAt(0) - 87 : Number(d), 
        // @ts-ignore
        d = b.charAt(c + 1) == Yb ? a >>> d : a << d;
        a = b.charAt(c) == Yb ? a + d & 4294967295 : a ^ d;
    }
    return a;
}
//# sourceMappingURL=google_translate.js.map