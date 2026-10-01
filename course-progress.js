/* RTLH – course-progress.js
   Tracks lessons + quiz score, issues the certificate, and encodes/decodes verification data.
   Include on EVERY lesson page, on certificate.html and on verify.html */
(function () {
  var SITE = "https://theonesteniyibigira6-hue.github.io/RWANDA-TECH-LEARNING-HUB./";
  var SALT = "change-this-secret-word-2026";           // <- change it to any private text
  var COURSE = {
    code: "web-development-fundamentals",
    title: "WEB DEVELOPMENT FUNDAMENTALS",
    totalLessons: 42, weeks: 8, level: "Beginner", passMark: 70
  };
  var PK = "rtlh_progress_" + COURSE.code, CK = "rtlh_cert_" + COURSE.code;

  function load(k, d) { try { return JSON.parse(localStorage.getItem(k)) || d; } catch (e) { return d; } }
  function save(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function state() { return load(PK, { name: "", lessons: {}, score: 0 }); }

  function hash(s) {                                   // small checksum, detects edited links
    var h = 5381; s = s + SALT;
    for (var i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
    return h.toString(36).toUpperCase();
  }
  function enc(o) { return btoa(unescape(encodeURIComponent(JSON.stringify(o)))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""); }
  function dec(t) {
    t = t.replace(/-/g, "+").replace(/_/g, "/"); while (t.length % 4) t += "=";
    return JSON.parse(decodeURIComponent(escape(atob(t))));
  }

  var RTLH = {
    SITE: SITE, COURSE: COURSE, state: state,
    setName: function (n) { var s = state(); s.name = n.trim(); save(PK, s); },
    saveScore: function (pct) { var s = state(); s.score = Math.max(s.score, Math.round(pct)); save(PK, s); RTLH.check(); },
    completeLesson: function (n) {
      var s = state(); s.lessons[n] = true; save(PK, s);
      RTLH.updateBar(); RTLH.check();
    },
    done: function () { return Object.keys(state().lessons).length; },
    percent: function () { return Math.round(RTLH.done() / COURSE.totalLessons * 100); },
    eligible: function () { return RTLH.done() >= COURSE.totalLessons && state().score >= COURSE.passMark && !!state().name; },
    updateBar: function () {                           // optional: <div id="rtlh-bar"></div>
      var b = document.getElementById("rtlh-bar");
      if (b) b.innerHTML = '<div style="background:#e5e7eb;border-radius:8px;overflow:hidden"><div style="height:10px;width:' +
        RTLH.percent() + '%;background:#0b7a3b"></div></div><small>' + RTLH.done() + "/" + COURSE.totalLessons + " lessons – " + RTLH.percent() + "%</small>";
    },
    check: function () {                               // goes to the certificate automatically
      if (RTLH.eligible() && !/certificate\.html$/.test(location.pathname)) location.href = "certificate.html";
    },
    issue: function () {                               // same certificate every time it is opened
      var c = load(CK, null); if (c) return c;
      var s = state(), d = new Date(), p = function (x) { return String(x).padStart(2, "0"); };
      c = {
        i: "RTLH-" + d.getFullYear() + "-" + p(d.getMonth() + 1) + p(d.getDate()) + "-" + String(Math.floor(Math.random() * 900) + 100),
        n: s.name, c: COURSE.title, d: d.toISOString().slice(0, 10), s: s.score, w: COURSE.weeks, t: COURSE.totalLessons, l: COURSE.level
      };
      c.h = hash(c.i + c.n + c.c + c.d + c.s); save(CK, c); return c;
    },
    verifyUrl: function (c) { return SITE + "verify.html?c=" + enc(c); },
    decode: dec,
    valid: function (c) { return c.h === hash(c.i + c.n + c.c + c.d + c.s); },
    prettyDate: function (iso) {
      return new Date(iso + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
    }
  };
  window.RTLH = RTLH;
  document.addEventListener("DOMContentLoaded", RTLH.updateBar);
})();
