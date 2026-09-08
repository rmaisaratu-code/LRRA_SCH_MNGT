/* Learning Roots Royal Academy — SMS shared app logic */
(function () {
  "use strict";
  const SCHOOL = window.SCHOOL;

  // ---------- Session ----------
  const SESSION_KEY = "lrra_sms_session";
  function getSession() { try { return JSON.parse(localStorage.getItem(SESSION_KEY)); } catch (e) { return null; } }
  function setSession(s) { localStorage.setItem(SESSION_KEY, JSON.stringify(s)); }
  function clearSession() { localStorage.removeItem(SESSION_KEY); }
  function requireRole(roles) {
    const s = getSession();
    if (!s || !roles.includes(s.role)) { window.location.href = "index.html"; return null; }
    return s;
  }

  // ---------- Edits overlay (persisted in localStorage, merged onto base data) ----------
  const EDITS_KEY = "lrra_sms_edits";
  function loadEdits() { try { return JSON.parse(localStorage.getItem(EDITS_KEY)) || {}; } catch (e) { return {}; } }
  function saveEdits(e) { localStorage.setItem(EDITS_KEY, JSON.stringify(e)); }
  const EDITS = loadEdits();
  // structure: { studentComments:{[id]:[...]}, teacherComments:{[id]:[...]}, scores:{[studentId]:{[subject]:{...}}},
  //              lessonPlans:{[planId]:{...}}, attendanceTicks:{[teacherId]:[...]}, driverComments:{[driverId]:[...]},
  //              announcements:[...] }
  function persist() { saveEdits(EDITS); }

  function addStudentComment(studentId, entry) {
    EDITS.studentComments = EDITS.studentComments || {};
    EDITS.studentComments[studentId] = EDITS.studentComments[studentId] || [];
    EDITS.studentComments[studentId].push(entry);
    persist();
  }
  function addTeacherComment(teacherId, entry) {
    EDITS.teacherComments = EDITS.teacherComments || {};
    EDITS.teacherComments[teacherId] = EDITS.teacherComments[teacherId] || [];
    EDITS.teacherComments[teacherId].push(entry);
    persist();
  }
  function getStudentComments(student) {
    const extra = (EDITS.studentComments && EDITS.studentComments[student.id]) || [];
    return student.comments.concat(extra);
  }
  function getTeacherComments(teacher) {
    const extra = (EDITS.teacherComments && EDITS.teacherComments[teacher.id]) || [];
    return teacher.comments.concat(extra);
  }
  function updateScore(studentId, subject, patch) {
    EDITS.scores = EDITS.scores || {};
    EDITS.scores[studentId] = EDITS.scores[studentId] || {};
    EDITS.scores[studentId][subject] = Object.assign({}, EDITS.scores[studentId][subject], patch);
    persist();
  }
  function getScore(student, subject) {
    const base = student.scores[subject];
    const override = EDITS.scores && EDITS.scores[student.id] && EDITS.scores[student.id][subject];
    return Object.assign({}, base, override || {});
  }
  function updateLessonPlan(planId, patch) {
    EDITS.lessonPlans = EDITS.lessonPlans || {};
    EDITS.lessonPlans[planId] = Object.assign({}, EDITS.lessonPlans[planId], patch);
    persist();
  }
  function getLessonPlan(plan) {
    const override = EDITS.lessonPlans && EDITS.lessonPlans[plan.id];
    return Object.assign({}, plan, override || {});
  }
  function tickAttendance(teacherId, entry) {
    EDITS.attendanceTicks = EDITS.attendanceTicks || {};
    EDITS.attendanceTicks[teacherId] = EDITS.attendanceTicks[teacherId] || [];
    EDITS.attendanceTicks[teacherId].push(entry);
    persist();
  }
  function getAttendanceLog(teacher) {
    const extra = (EDITS.attendanceTicks && EDITS.attendanceTicks[teacher.id]) || [];
    return teacher.attendanceLog.concat(extra);
  }
  function addDriverComment(driverId, entry) {
    EDITS.driverComments = EDITS.driverComments || {};
    EDITS.driverComments[driverId] = EDITS.driverComments[driverId] || [];
    EDITS.driverComments[driverId].push(entry);
    persist();
  }
  function getDriverComments(driver) {
    const extra = (EDITS.driverComments && EDITS.driverComments[driver.id]) || [];
    return driver.comments.concat(extra);
  }
  function addAnnouncement(entry) {
    EDITS.announcements = EDITS.announcements || [];
    EDITS.announcements.unshift(entry);
    persist();
  }
  function getAnnouncements() {
    return (EDITS.announcements || []).concat(SCHOOL.announcements);
  }

  // ---------- Helpers ----------
  function nowIso() { return new Date().toISOString().slice(0, 19); }
  function fmtDate(iso) {
    const d = new Date(iso);
    return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  }
  function fmtDateTime(iso) {
    const d = new Date(iso);
    return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) + " · " +
      d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  }
  function money(n) { return "₦" + Number(n).toLocaleString("en-NG"); }
  function initials(name) {
    return name.replace(/^(Mr\.|Mrs\.|Miss)\s/, "").split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
  }
  function avatarDataUri(name, seed) {
    const colors = ["#111b52", "#2638a5", "#d7a947", "#1f8a4c", "#c22b3a", "#8a8f9c"];
    const bg = colors[(seed || name.length) % colors.length];
    const txt = initials(name);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" rx="50" fill="${bg}"/><text x="50" y="58" font-family="Georgia,serif" font-size="34" fill="#fff" text-anchor="middle" font-weight="bold">${txt}</text></svg>`;
    return "data:image/svg+xml;base64," + btoa(svg);
  }
  function houseColor(name) {
    const h = SCHOOL.houses.find(h => h.name === name);
    return h ? h.color : "#999";
  }
  function feeBadge(status) {
    const map = { Paid: "green", Partial: "yellow", Unpaid: "red" };
    const cls = map[status] || "gray";
    return `<span class="badge ${cls}"><span class="badge-dot" style="background:currentColor"></span>${status}</span>`;
  }
  function gradePill(grade) {
    return `<span class="grade-pill grade-${grade}">${grade}</span>`;
  }
  function toast(msg) {
    let el = document.getElementById("toast");
    if (!el) { el = document.createElement("div"); el.id = "toast"; el.className = "toast"; document.body.appendChild(el); }
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.remove("show"), 2600);
  }
  function esc(s) { const d = document.createElement("div"); d.textContent = s == null ? "" : s; return d.innerHTML; }

  // ---------- Lightweight SVG charts (no external library needed) ----------
  function renderDonutChart(container, segments, opts) {
    opts = opts || {};
    const size = opts.size || 180, stroke = opts.stroke || 26, r = (size - stroke) / 2, c = size / 2;
    const circumference = 2 * Math.PI * r;
    const total = segments.reduce((s, seg) => s + seg.value, 0) || 1;
    let offset = 0;
    const arcs = segments.map(seg => {
      const frac = seg.value / total;
      const dash = frac * circumference;
      const gap = circumference - dash;
      const rotation = (offset / total) * 360 - 90;
      offset += seg.value;
      return `<circle cx="${c}" cy="${c}" r="${r}" fill="none" stroke="${seg.color}" stroke-width="${stroke}" stroke-dasharray="${dash} ${gap}" transform="rotate(${rotation} ${c} ${c})"></circle>`;
    }).join("");
    const legend = segments.map(seg => `<div style="display:flex;align-items:center;gap:6px;font-size:12.5px;margin-bottom:4px"><span style="width:10px;height:10px;border-radius:3px;background:${seg.color};display:inline-block"></span>${esc(seg.label)} — <b>${Math.round(seg.value / total * 100)}%</b></div>`).join("");
    container.innerHTML = `<div style="display:flex;align-items:center;gap:22px;flex-wrap:wrap">
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">${arcs}</svg>
      <div>${legend}</div></div>`;
  }

  function renderBarChart(container, categories, series, opts) {
    // series: [{name, color, values:[...]}] aligned with categories
    opts = opts || {};
    const w = opts.width || 560, h = opts.height || 220, pad = 34;
    const allVals = series.flatMap(s => s.values);
    const max = Math.max(1, ...allVals);
    const groupW = (w - pad * 2) / categories.length;
    const barW = (groupW - 10) / series.length;
    let bars = "";
    categories.forEach((cat, ci) => {
      series.forEach((s, si) => {
        const val = s.values[ci] || 0;
        const barH = (val / max) * (h - pad * 2);
        const x = pad + ci * groupW + si * barW + 4;
        const y = h - pad - barH;
        bars += `<rect x="${x}" y="${y}" width="${barW - 4}" height="${barH}" fill="${s.color}" rx="3"></rect>`;
      });
      bars += `<text x="${pad + ci * groupW + groupW / 2}" y="${h - 10}" font-size="11" fill="var(--muted,#888)" text-anchor="middle">${esc(cat)}</text>`;
    });
    const legend = series.map(s => `<span style="display:inline-flex;align-items:center;gap:5px;font-size:12px;margin-right:14px"><span style="width:10px;height:10px;border-radius:3px;background:${s.color};display:inline-block"></span>${esc(s.name)}</span>`).join("");
    container.innerHTML = `<svg width="100%" height="${h}" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid meet"><line x1="${pad}" y1="${h - pad}" x2="${w - pad}" y2="${h - pad}" stroke="#ccc"></line>${bars}</svg><div style="margin-top:6px">${legend}</div>`;
  }

  function paymentBar(fees) {
    const total = Object.values(fees).reduce((s, f) => s + f.total, 0);
    const paid = Object.values(fees).reduce((s, f) => s + f.paid, 0);
    const pct = total ? Math.round((paid / total) * 100) : 0;
    let color = "#c22b3a";
    if (pct >= 95) color = "#1f8a4c"; else if (pct >= 40) color = "#c8930a";
    return `<div class="paybar-track"><span style="width:${pct}%;background:${color}"></span></div>`;
  }

  function renderCommentThread(container, comments, opts) {
    opts = opts || {};
    if (!comments.length) { container.innerHTML = '<p class="empty-note">No comments yet.</p>'; return; }
    container.innerHTML = comments.map(c => `
      <div class="comment">
        <div class="comment-head">
          <div><span class="comment-author">${esc(c.author)}</span><span class="comment-role">${esc(c.role)}</span></div>
          <span class="comment-time">${fmtDateTime(c.timestamp)}</span>
        </div>
        <div class="comment-text">${esc(c.text)}</div>
        ${c.reply ? `<div class="comment-reply comment">
          <div class="comment-head">
            <div><span class="comment-author">${esc(c.reply.author)}</span><span class="comment-role">${esc(c.reply.role)}</span></div>
            <span class="comment-time">${fmtDateTime(c.reply.timestamp)}</span>
          </div>
          <div class="comment-text">${esc(c.reply.text)}</div>
        </div>` : ""}
      </div>`).join("");
  }

  // ---------- Sidebar / mobile toggle ----------
  function wireChrome(session) {
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
      // Inline styling guarantees visibility for live demos regardless of stylesheet state.
      logoutBtn.style.cssText = "background:#c22b3a;color:#fff;border:none;padding:8px 16px;border-radius:8px;font-weight:700;cursor:pointer;white-space:nowrap;";
      logoutBtn.textContent = "⏻ Sign Out";
      logoutBtn.addEventListener("click", () => { clearSession(); window.location.href = "index.html"; });
    }
    const toggle = document.getElementById("mobileToggle");
    const side = document.querySelector(".side");
    if (toggle && side) toggle.addEventListener("click", () => side.classList.toggle("open"));
    document.querySelectorAll("[data-view-link]").forEach(link => {
      link.addEventListener("click", () => {
        document.querySelectorAll("[data-view-link]").forEach(l => l.classList.remove("active"));
        link.classList.add("active");
        document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
        const target = document.getElementById(link.getAttribute("data-view-link"));
        if (target) target.classList.add("active");
        if (side) side.classList.remove("open");
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    });
    const termPill = document.getElementById("termPill");
    if (termPill) termPill.textContent = SCHOOL.terms.find(t => t.id === SCHOOL.currentTermId).name;
    const rolePill = document.getElementById("rolePill");
    if (rolePill && session) rolePill.textContent = session.label;
  }

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => { navigator.serviceWorker.register("sw.js").catch(()=>{}); });
  }

  window.APP = {
    SCHOOL, getSession, setSession, clearSession, requireRole,
    addStudentComment, addTeacherComment, getStudentComments, getTeacherComments,
    updateScore, getScore, updateLessonPlan, getLessonPlan,
    tickAttendance, getAttendanceLog, addDriverComment, getDriverComments,
    addAnnouncement, getAnnouncements,
    nowIso, fmtDate, fmtDateTime, money, initials, avatarDataUri, houseColor,
    feeBadge, gradePill, toast, esc, paymentBar, renderCommentThread, wireChrome,
    renderDonutChart, renderBarChart
  };
})();
