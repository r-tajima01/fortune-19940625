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
    var T = '#9aa8bd';
    // ---- Chart A: 長期(大運の地力) × 中期(年スコア) 折れ線 ----
    var W = 480, H = 280, L = 34, R = 34, TP = 26, B = 46;
    var sx = function (a) { return L + (W - L - R) * a / maxAge; };
    var base = H - B, top = TP, span = base - top;
    var yL = function (v) { return base - span * v / 5; };
    var yR = function (v) { return base - span * (v + 5) / 10; };
    var svg = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="長期と中期の折れ線グラフ">';
    for (var g = 0; g <= 5; g++) {
      svg += '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + yL(g) + '" y2="' + yL(g) + '" stroke="#2a3447" stroke-dasharray="3 4"/>';
      svg += '<text x="' + (L - 6) + '" y="' + (yL(g) + 4) + '" fill="#5eead4" font-size="11" text-anchor="end">' + g + '</text>';
    }
    [-5, 0, 5].forEach(function (v) { svg += '<text x="' + (W - R + 6) + '" y="' + (yR(v) + 4) + '" fill="#fbbf24" font-size="11">' + (v > 0 ? "+" : "") + v + '</text>'; });
    svg += '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + yR(0) + '" y2="' + yR(0) + '" stroke="#566480"/>';
    // 現在の大運の帯
    D.decades.forEach(function (d) {
      if (D.nowAge >= d.r[0] && D.nowAge <= d.r[1]) svg += '<rect x="' + sx(d.r[0]) + '" y="' + top + '" width="' + (sx(d.r[1] + 1) - sx(d.r[0])) + '" height="' + span + '" fill="rgba(251,191,36,.08)"/>';
    });
    // 長期：大運の地力(中点を結ぶ)
    var lp = D.decades.map(function (d) { return [sx((d.r[0] + d.r[1] + 1) / 2), yL(d.lv), d]; });
    svg += '<polyline fill="none" stroke="#14b8a6" stroke-width="3.5" stroke-linejoin="round" points="' + lp.map(function (p) { return p[0] + "," + p[1]; }).join(" ") + '"/>';
    lp.forEach(function (p) {
      svg += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="4.5" fill="#14b8a6" stroke="#0d1117" stroke-width="2"/>';
      svg += '<text x="' + p[0] + '" y="' + (p[1] - 10) + '" fill="#e6ecf5" font-size="12" font-weight="700" text-anchor="middle">' + p[2].ju.replace(/[()（）]/g, "").split("・")[0] + '</text>';
    });
    // 中期：年スコア(2024-2040)
    var yp = D.years.map(function (y) { return [sx(y[1] + 0.5), yR(y[2]), y]; });
    svg += '<polyline fill="none" stroke="#fbbf24" stroke-width="2.5" stroke-linejoin="round" points="' + yp.map(function (p) { return p[0] + "," + p[1]; }).join(" ") + '"/>';
    yp.forEach(function (p) { svg += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="2.8" fill="' + (p[2][2] < 0 ? "#f87171" : "#fbbf24") + '"/>'; });
    // 横軸
    for (var a = 0; a <= maxAge; a += 10) svg += '<text x="' + sx(a) + '" y="' + (base + 16) + '" fill="' + T + '" font-size="11" text-anchor="middle">' + a + '歳</text>';
    svg += '<line x1="' + sx(D.nowAge + 0.5) + '" x2="' + sx(D.nowAge + 0.5) + '" y1="' + top + '" y2="' + base + '" stroke="#fbbf24" stroke-dasharray="4 3"/>';
    svg += '<text x="' + sx(D.nowAge + 0.5) + '" y="' + (base + 34) + '" fill="#fbbf24" font-size="13" font-weight="800" text-anchor="middle">▲ いま(' + D.nowAge + '歳)</text></svg>';

    // ---- Chart B: 短期(2026-2028 月別) 折れ線 ----
    var pts = [];
    [2026, 2027, 2028].forEach(function (yr) { D.months[yr].forEach(function (m) { pts.push({ yr: yr, m: m[0], s: m[1] }); }); });
    var W2 = 480, H2 = 220, L2 = 34, R2 = 14, T2 = 24, B2 = 40;
    var n = pts.length, sx2 = function (i) { return L2 + (W2 - L2 - R2) * i / (n - 1); };
    var b2 = H2 - B2, sp2 = b2 - T2, y2 = function (v) { return b2 - sp2 * (v + 5) / 10; };
    var s2 = '<svg viewBox="0 0 ' + W2 + ' ' + H2 + '" role="img" aria-label="2026〜2028年の月別折れ線グラフ">';
    [-4, -2, 0, 2, 4].forEach(function (v) {
      s2 += '<line x1="' + L2 + '" x2="' + (W2 - R2) + '" y1="' + y2(v) + '" y2="' + y2(v) + '" stroke="' + (v === 0 ? "#566480" : "#2a3447") + '" stroke-dasharray="' + (v === 0 ? "" : "3 4") + '"/>';
      s2 += '<text x="' + (L2 - 6) + '" y="' + (y2(v) + 4) + '" fill="' + T + '" font-size="11" text-anchor="end">' + (v > 0 ? "+" : "") + v + '</text>';
    });
    pts.forEach(function (p, i) {
      if (p.m === 2 && i > 0) s2 += '<line x1="' + (sx2(i) - 6) + '" x2="' + (sx2(i) - 6) + '" y1="' + T2 + '" y2="' + b2 + '" stroke="#3b4963"/>';
      if (p.m === 2) s2 += '<text x="' + (sx2(i) + 4) + '" y="' + (b2 + 32) + '" fill="#e6ecf5" font-size="13" font-weight="800">' + p.yr + '年</text>';
      if (p.m % 2 === 0) s2 += '<text x="' + sx2(i) + '" y="' + (b2 + 15) + '" fill="' + T + '" font-size="10" text-anchor="middle">' + p.m + '</text>';
    });
    s2 += '<polyline fill="none" stroke="#14b8a6" stroke-width="3" stroke-linejoin="round" points="' + pts.map(function (p, i) { return sx2(i) + "," + y2(p.s); }).join(" ") + '"/>';
    pts.forEach(function (p, i) {
      var c = p.s <= -2 ? "#f87171" : p.s >= 1 ? "#2dd4bf" : "#9aa8bd";
      s2 += '<circle cx="' + sx2(i) + '" cy="' + y2(p.s) + '" r="' + (Math.abs(p.s) >= 3 ? 5 : 3.5) + '" fill="' + c + '"/>';
      if (Math.abs(p.s) >= 3) s2 += '<text x="' + sx2(i) + '" y="' + (y2(p.s) + (p.s < 0 ? 17 : -9)) + '" fill="' + c + '" font-size="11" font-weight="800" text-anchor="middle">' + p.m + '月</text>';
    });
    s2 += '</svg>';

    var h = "<h2>人生全体 × 近い年（折れ線）</h2>";
    h += '<p class="lead"><b style="color:#5eead4">緑の線</b>は10年大運ごとの地力(左軸・5段階)、<b style="color:#fbbf24">黄色の線</b>は2024〜2040年の年ごとの総合スコア(右軸・−5〜+5)です。点線が現在地、薄い帯が現在の大運です。</p>';
    h += '<div class="chart">' + svg + '</div>';
    h += '<h2>この3年（月ごとの折れ線）</h2>';
    h += '<p class="lead">2026年2月〜2028年12月の月別スコアです。赤い点は消耗・要注意の月、緑の点は追い風の月です。±3以上の月には月名を付けています。</p>';
    h += '<div class="chart">' + s2 + '</div>';
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
