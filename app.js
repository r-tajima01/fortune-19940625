(function () {
  var id = document.body.dataset.id;
  var D = DATA[id];
  var P = DATA.pair;
  var $ = function (s) { return document.querySelector(s); };

  function cls(s) {
    if (s >= 3) return "s-p3";
    if (s === 2) return "s-p2";
    if (s === 1) return "s-p1";
    if (s === 0) return "s-z";
    if (s === -1) return "s-m1";
    if (s === -2) return "s-m2";
    return "s-m3";
  }
  function sg(s) { return (s > 0 ? "+" : "") + s; }
  function list(a) { return "<ul>" + a.map(function (x) { return "<li>" + x + "</li>"; }).join("") + "</ul>"; }
  function stars(n) { return "★".repeat(n) + "☆".repeat(5 - n); }
  var polName = { g: ["追い風", "pol-g"], w: ["転換", "pol-w"], b: ["要注意", "pol-b"], n: ["節目", "pol-n"] };

  // ---------- switch + hero ----------
  var html = "";
  html += '<div class="switch"><a href="index.html" class="' + (id === "k94" ? "on" : "") + '">1994.06.25（男性）</a><a href="19960303.html" class="' + (id === "k96" ? "on" : "") + '">1996.03.03（女性）</a></div>';
  html += '<div class="wrap"><header class="hero"><div class="eyebrow">' + D.eyebrow + '</div><h1>' + D.title + '</h1><p class="sub">' + D.sub + '</p>';
  html += '<div class="quote">' + D.quote + '</div><div class="chips">' + D.chips.map(function (c) { return '<div class="chip"><b>' + c[0] + '</b><span>' + c[1] + '</span></div>'; }).join("") + '</div></header></div>';
  html += '<nav class="tabs"><div class="in" id="tabs"></div></nav><div class="wrap" id="panes"></div>';
  html += '<p class="foot">Agy × Claude Opus 共同監査｜生年月日のみから導出｜予言ではなく自己理解のたたき台です</p>';
  document.body.innerHTML = html;

  // ---------- panes ----------
  var panes = [];

  // 1. まとめ
  (function () {
    var h = "";
    h += "<h2>3つのポイント</h2>";
    h += '<div class="grid3">' + D.points.map(function (p, i) {
      return '<div class="card pt"><div class="n">' + (i + 1) + '</div><div><h3>' + p[0] + '</h3><p>' + p[1] + '</p></div></div>';
    }).join("") + "</div>";
    h += "<h2>いま（2026年10月）</h2>";
    h += '<div class="card now"><span class="tag">NOW</span><h3>' + D.now.head + '</h3><p>' + D.now.body + '</p><div class="two"><div class="do"><b>やること</b>' + list(D.now.doIt) + '</div><div class="dont"><b>避けること</b>' + list(D.now.dont) + '</div></div></div>';
    h += "<h2>これからの3年</h2>";
    h += '<div class="legend"><span><i class="s-p2"></i>追い風</span><span><i class="s-z"></i>平常</span><span><i class="s-m2"></i>消耗・要注意</span><span>数字は総合スコア(−5〜+5)</span></div>';
    h += D.next.map(function (n) {
      return '<div class="card yr"><div class="badge ' + cls(n.s) + '"><small>' + n.y + '</small><span class="v">' + sg(n.s) + '</span><small>' + n.a + '歳</small></div><div><h3>' + n.t + '</h3><p>' + n.d + '</p></div></div>';
    }).join("");
    h += '<p class="lead">年ごとの詳しい一覧は「年表」タブ、月ごとの注意月は「年表」の下部にあります。</p>';
    panes.push(["まとめ", h]);
  })();

  // 2. 気質・適職
  (function () {
    var h = "<h2>人物の核</h2>";
    h += '<div class="card"><p><span class="lab lab-c">計算で確定</span>' + D.core + '</p><p class="lead" style="margin-top:6px">' + D.coreNote + '</p></div>';
    h += "<h2>光と影</h2>";
    h += '<div class="two"><div class="do"><b>強み</b>' + list(D.strengths) + '</div><div class="dont"><b>消耗の地雷</b>' + list(D.shadows) + '</div></div>';
    h += "<h2>向いている仕事・スタイル</h2>";
    h += D.jobs.map(function (j, i) { return '<div class="card pt"><div class="n">' + "ABC"[i] + '</div><div><h3>' + j[0] + '</h3><p>' + j[1] + '</p></div></div>'; }).join("");
    h += '<div class="note"><span class="lab lab-i">解釈</span>' + D.jobNote + '</div>';
    h += '<div class="card"><h3>環境の条件</h3><p>' + D.envRule + '</p></div>';
    panes.push(["気質・適職", h]);
  })();

  // 3. 人生の波
  (function () {
    var maxAge = D.decades[D.decades.length - 1].r[1] + 1;
    var W = 480, H = 240, L = 10, R = 10, T = 28, B = 40;
    var sx = function (a) { return L + (W - L - R) * a / maxAge; };
    var base = H - B, uh = (base - T) / 5;
    var svg = '<svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="10年大運ごとの地力の目安">';
    for (var g = 1; g <= 5; g++) svg += '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + (base - g * uh) + '" y2="' + (base - g * uh) + '" stroke="#2a3447" stroke-dasharray="3 4"/>';
    D.decades.forEach(function (d) {
      var x = sx(d.r[0]), w = sx(d.r[1] + 1) - x - 3, hh = d.lv * uh;
      var cur = D.nowAge >= d.r[0] && D.nowAge <= d.r[1];
      var fill = cur ? "#fbbf24" : (d.lv >= 4 ? "#14b8a6" : d.lv === 3 ? "rgba(20,184,166,.6)" : "rgba(148,163,184,.45)");
      svg += '<rect x="' + x + '" y="' + (base - hh) + '" width="' + w + '" height="' + hh + '" rx="6" fill="' + fill + '"/>';
      svg += '<text x="' + (x + w / 2) + '" y="' + (base - hh - 6) + '" fill="#e6ecf5" font-size="14" font-weight="700" text-anchor="middle">' + d.ju.replace(/[()（）]/g, "").split("・")[0] + '</text>';
      svg += '<text x="' + (x + w / 2) + '" y="' + (base + 16) + '" fill="#9aa8bd" font-size="11" text-anchor="middle">' + d.r[0] + '〜' + d.r[1] + '歳</text>';
    });
    svg += '<text x="' + sx(D.nowAge) + '" y="' + (base + 33) + '" fill="#fbbf24" font-size="14" font-weight="800" text-anchor="middle">▲ いま(' + D.nowAge + '歳)</text></svg>';
    var h = "<h2>10年ごとの地力の目安</h2>";
    h += '<p class="lead">棒の高さは大運の十二運から読んだ5段階の目安です(黄色が現在の大運)。数値の精密さではなく、どの10年が上り坂かを見る図です。</p>';
    h += '<div class="chart">' + svg + '</div>';
    h += "<h2>10年ごとのテーマ</h2><div class=\"tl\">";
    h += D.decades.map(function (d) {
      var cur = D.nowAge >= d.r[0] && D.nowAge <= d.r[1];
      return '<div class="it ' + (cur ? "cur" : (d.lv >= 4 ? "big" : "")) + '"><div class="when">' + d.r[0] + '〜' + d.r[1] + '歳（' + d.y + '）' + (cur ? ' <span class="pill pol-w">いまここ</span>' : "") + '</div><h3>' + d.ju + ' <span class="ju">' + d.st + '</span> <span class="stars">' + stars(d.lv) + '</span></h3><p>' + d.t + '</p></div>';
    }).join("") + "</div>";
    var big = D.tps.filter(function (t) { return t[2] >= 70; });
    var rest = D.tps.filter(function (t) { return t[2] < 70; });
    var tpRow = function (t) {
      var pn = polName[t[3]];
      return '<div class="it ' + (t[2] >= 80 ? "big" : "") + '"><div class="when">' + t[0] + '歳（' + t[1] + '）<span class="pill ' + pn[1] + '">' + pn[0] + '</span> <span class="ju">強度 ' + t[2] + '</span></div><h3>' + t[4] + '</h3><p>' + t[5] + '</p></div>';
    };
    h += "<h2>ターニングポイント</h2><p class=\"lead\">強度70以上の転換点です。強度は0〜100で、東洋と西洋の根拠が重なるほど高くなります。</p>";
    h += '<div class="tl">' + big.map(tpRow).join("") + "</div>";
    h += '<details><summary>強度70未満の節目も見る</summary><div class="body"><div class="tl">' + rest.map(tpRow).join("") + "</div></div></details>";
    panes.push(["人生の波", h]);
  })();

  // 4. 年表
  (function () {
    var h = "<h2>年ごとの流れ（2024〜2040年）</h2>";
    h += '<div class="legend"><span><i style="background:#2dd4bf"></i>追い風</span><span><i style="background:#f87171"></i>消耗・要注意</span><span>数字は総合スコア(−5〜+5)</span></div>';
    h += '<div class="card" style="padding:6px 16px">';
    h += D.years.map(function (y) {
      var s = y[2], w = Math.abs(s) / 5 * 50;
      var bar = s >= 0 ? 'left:50%;width:' + w + '%;background:#2dd4bf' : 'right:50%;width:' + w + '%;background:#f87171';
      var col = s > 0 ? "var(--good)" : s < 0 ? "var(--bad)" : "var(--mute)";
      return '<details style="border:0;background:none;margin:0"><summary class="ysum"><div class="ybar ' + (y[0] === 2026 ? "cur" : "") + '"><div class="y">' + y[0] + '<small>' + y[1] + '歳</small></div><div class="tr"><i style="' + bar + '"></i></div><div class="sc" style="color:' + col + '">' + sg(s) + '</div><div class="tx">' + y[3] + '</div></div></summary><div class="note" style="margin:0 0 8px">' + y[4] + '</div></details>';
    }).join("");
    h += "</div><p class=\"lead\">各行をタップすると、その年の根拠(干支・大運・トランジット・九星)が開きます。</p>";

    h += "<h2>月ごとの流れ（2026〜2028年）</h2>";
    h += '<p class="lead">' + D.monthsIntro + '</p><div class="note">' + D.recur + '</div>';
    [2026, 2027, 2028].forEach(function (yr) {
      var ms = D.months[yr];
      h += "<h3 style=\"margin-top:14px\">" + yr + "年</h3><div class=\"heat\">" + ms.map(function (m) {
        return '<div class="cell ' + cls(m[1]) + '"><small>' + m[0] + '月</small><span>' + sg(m[1]) + '</span></div>';
      }).join("") + "</div>";
      var notes = ms.filter(function (m) { return m[2]; });
      h += notes.map(function (m) { return '<p class="mn"><b>' + m[0] + '月（' + sg(m[1]) + '）</b>　' + m[2] + '</p>'; }).join("");
    });
    h += '<div class="note">' + D.monthsSummary + '</div>';
    panes.push(["年表", h]);
  })();

  // 5. 二人の力学
  (function () {
    var h = "<h2>" + P.title + "</h2><p class=\"lead\">" + P.lead + "</p>";
    h += "<h2>噛み合う点</h2>" + P.fit.map(function (f) { return '<div class="card"><h3>' + f[0] + '</h3><p>' + f[1] + '</p></div>'; }).join("");
    h += "<h2>摩擦しやすい点</h2>" + P.friction.map(function (f) { return '<div class="card" style="border-color:rgba(248,113,113,.4)"><h3>' + f[0] + '</h3><p>' + f[1] + '</p></div>'; }).join("");
    h += "<h2>運用ルール</h2><div class=\"card\">" + list(P.rules) + "</div>";
    h += '<p class="lead"><a href="' + (id === "k94" ? "19960303.html" : "index.html") + '">' + (id === "k94" ? "1996.03.03版(女性)" : "1994.06.25版(男性)") + 'を見る →</a></p>';
    panes.push(["二人の力学", h]);
  })();

  // 6. 根拠・注意
  (function () {
    var h = "<h2>根拠・計算の詳細</h2><p class=\"lead\">ここから先は読み飛ばして構いません。数字や配置の元データです。</p>";
    h += D.details.map(function (d) { return '<details><summary>' + d[0] + '</summary><div class="body">' + d[1] + '</div></details>'; }).join("");
    h += '<p class="lead"><span class="lab lab-c">計算で確定</span>暦から機械的に決まる値(干支・大運・九星・数秘)　<span class="lab lab-i">解釈</span>流派や象意による読み</p>';
    panes.push(["根拠・注意", h]);
  })();

  var tabs = $("#tabs"), pn = $("#panes");
  panes.forEach(function (p, i) {
    var b = document.createElement("button");
    b.className = "tab" + (i === 0 ? " on" : "");
    b.textContent = p[0];
    b.onclick = function () { show(i); };
    tabs.appendChild(b);
    var s = document.createElement("section");
    s.className = "pane" + (i === 0 ? " on" : "");
    s.innerHTML = p[1];
    pn.appendChild(s);
  });
  function show(i) {
    var bs = tabs.children, ss = pn.children;
    for (var k = 0; k < bs.length; k++) { bs[k].classList.toggle("on", k === i); ss[k].classList.toggle("on", k === i); }
    bs[i].scrollIntoView({ inline: "center", block: "nearest" });
    window.scrollTo(0, document.querySelector("nav.tabs").offsetTop);
    history.replaceState(null, "", "#" + i);
  }
  var h0 = parseInt((location.hash || "").slice(1), 10);
  if (!isNaN(h0) && h0 >= 0 && h0 < panes.length) show(h0);
})();
