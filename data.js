/* Learning Roots Royal Academy — School Management System
   Seeded demo dataset generator. Deterministic (same seed = same data every load)
   so localStorage edits layer cleanly on top of a stable base. */

(function () {
  "use strict";

  // ---------- Seeded RNG ----------
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const rng = mulberry32(20250901);
  const R = () => rng();
  const randInt = (min, max) => Math.floor(R() * (max - min + 1)) + min;
  const choice = (arr) => arr[Math.floor(R() * arr.length)];
  const weightedChoice = (pairs) => {
    const total = pairs.reduce((s, p) => s + p[1], 0);
    let r = R() * total;
    for (const [val, w] of pairs) { if (r < w) return val; r -= w; }
    return pairs[0][0];
  };
  const shuffle = (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1));[a[i], a[j]] = [a[j], a[i]]; } return a; };
  const pad = (n, len) => String(n).padStart(len, "0");

  // ---------- Name pools (Adamawa-region realistic mix) ----------
  const NAMES = {
    muslimMale: ["Muhammad","Abdullahi","Ibrahim","Yusuf","Umar","Ahmad","Aliyu","Bello","Sani","Musa","Suleiman","Mustapha","Isa","Adamu","Bashir","Nuhu","Sadiq","Faruk","Zakariya","Haruna","Abbas","Lawan","Kabiru","Auwal"],
    muslimFemale: ["Aisha","Fatima","Zainab","Hauwa","Amina","Maryam","Halima","Khadija","Safiya","Hadiza","Asma'u","Fadila","Ummi","Ramat","Jamila","Zulaihat","Rukayya","Maimuna","Salamatu","Nafisa","Zara","Balaraba"],
    muslimSurname: ["Mohammed","Abubakar","Ibrahim","Yusuf","Bello","Sani","Adamu","Usman","Aliyu","Umar","Sule","Waziri","Modu","Mustapha","Garba","Musa","Idris","Danjuma","Buba","Njidda","Alhassan","Shehu"],
    christianMale: ["Emmanuel","Samuel","David","Daniel","Joseph","Peter","John","James","Timothy","Stephen","Isaac","Yakubu","Yohanna","Markus","Filibus","Gideon","Caleb","Elisha","Barnabas","Vincent","Ishaya","Bulus"],
    christianFemale: ["Grace","Esther","Ruth","Deborah","Comfort","Blessing","Hannah","Naomi","Mary","Rebecca","Patience","Victoria","Joy","Mercy","Elizabeth","Talatu","Lami","Rhoda","Sarah","Christy","Gloria","Priscilla"],
    christianSurname: ["Michael","Peters","Danladi","Yakubu","Wakawa","Vandi","Zira","Mshelia","Kwaji","Ndahi","Waziri","Timothy","Samuel","Amos","Bulus","Gyang","Dlama","Mamza","Kwache","Vandi"],
    igboSurname: ["Okafor","Okonkwo","Eze","Nwosu","Chukwu","Obi","Nnamdi","Okoro"],
    yorubaSurname: ["Adebayo","Ogundele","Afolabi","Oyelaran","Bakare","Adeyemi"]
  };

  function makeStudentName(gender) {
    // weighting: 55% Muslim/Hausa-Fulani, 30% Christian local tribe, 10% Igbo, 5% Yoruba
    const group = weightedChoice([["muslim", 55], ["christian", 30], ["igbo", 10], ["yoruba", 5]]);
    let first, surname, religion;
    if (group === "muslim") {
      first = gender === "M" ? choice(NAMES.muslimMale) : choice(NAMES.muslimFemale);
      surname = choice(NAMES.muslimSurname);
      religion = "Islam";
    } else if (group === "christian") {
      first = gender === "M" ? choice(NAMES.christianMale) : choice(NAMES.christianFemale);
      surname = choice(NAMES.christianSurname);
      religion = "Christianity";
    } else if (group === "igbo") {
      first = gender === "M" ? choice(NAMES.christianMale) : choice(NAMES.christianFemale);
      surname = choice(NAMES.igboSurname);
      religion = "Christianity";
    } else {
      first = gender === "M" ? choice(NAMES.christianMale) : choice(NAMES.christianFemale);
      surname = choice(NAMES.yorubaSurname);
      religion = "Christianity";
    }
    return { name: `${first} ${surname}`, religion };
  }

  function makeTeacherName(gender) {
    const group = weightedChoice([["muslim", 45], ["christian", 40], ["igbo", 10], ["yoruba", 5]]);
    let first, surname;
    const title = gender === "M" ? "Mr." : (R() < 0.5 ? "Mrs." : "Miss");
    if (group === "muslim") { first = gender === "M" ? choice(NAMES.muslimMale) : choice(NAMES.muslimFemale); surname = choice(NAMES.muslimSurname); }
    else if (group === "christian") { first = gender === "M" ? choice(NAMES.christianMale) : choice(NAMES.christianFemale); surname = choice(NAMES.christianSurname); }
    else if (group === "igbo") { first = gender === "M" ? choice(NAMES.christianMale) : choice(NAMES.christianFemale); surname = choice(NAMES.igboSurname); }
    else { first = gender === "M" ? choice(NAMES.christianMale) : choice(NAMES.christianFemale); surname = choice(NAMES.yorubaSurname); }
    return `${title} ${first} ${surname}`;
  }

  // ---------- School meta ----------
  const SCHOOL_META = {
    name: "Learning Roots Royal Academy",
    motto: "Rooted in Character, Rising in Excellence",
    address: "Plot Y.P30, Kofare, Jimeta, Yola, Adamawa State, Nigeria",
    phone: "+234 816 867 3193",
    email: "info@learningrootsroyalacademy.com",
    logo: "assets/img/logo.png"
  };

  // ---------- Terms / calendar ----------
  const TERMS = [
    { id: "T1-2526", name: "First Term 2025/2026", start: "2025-09-08", end: "2025-12-12", current: false },
    { id: "T2-2526", name: "Second Term 2025/2026", start: "2026-01-05", end: "2026-04-10", current: true },
    { id: "T3-2526", name: "Third Term 2025/2026", start: "2026-04-27", end: "2026-07-24", current: false }
  ];
  const CURRENT_TERM_ID = "T2-2526";

  const CALENDAR_EVENTS = [
    { date: "2026-01-05", title: "Second Term Resumption", type: "Academic", desc: "All students return; assembly at 7:30am." },
    { date: "2026-01-12", title: "Inter-House Sports Trials Begin", type: "Sports", desc: "House captains coordinate trials for track events." },
    { date: "2026-02-02", title: "Mid-Term Test Week", type: "Academic", desc: "CA1 assessments across all classes." },
    { date: "2026-02-16", title: "Inter-House Debate Competition", type: "Competition", desc: "Preliminary rounds — all five houses." },
    { date: "2026-02-23", title: "Mid-Term Break Begins", type: "Break", desc: "School closes for a one-week mid-term break." },
    { date: "2026-03-02", title: "Resumption from Mid-Term Break", type: "Academic", desc: "Classes resume." },
    { date: "2026-03-09", title: "Inter-House Music & Dancing Festival", type: "Competition", desc: "Full-day event; parents invited." },
    { date: "2026-03-16", title: "CA2 Assessment Week", type: "Academic", desc: "Second continuous assessment across all subjects." },
    { date: "2026-03-23", title: "Inter-House Sports Competition (Finals)", type: "Sports", desc: "Athletics finals and house trophy presentation." },
    { date: "2026-03-30", title: "Parent-Teacher Conference", type: "Meeting", desc: "One-on-one result discussions, all classes." },
    { date: "2026-04-06", title: "Second Term Examinations Begin", type: "Exams", desc: "Full examination timetable in effect." },
    { date: "2026-04-10", title: "Second Term Ends", type: "Academic", desc: "School closes for the term." }
  ];

  // ---------- Houses (5, plain colors for easy bracket competitions) ----------
  const HOUSES = [
    { name: "Black House", color: "#1a1a1a" },
    { name: "Red House", color: "#c22b3a" },
    { name: "Green House", color: "#1f8a4c" },
    { name: "Yellow House", color: "#d7a947" },
    { name: "White House", color: "#8a8f9c" }
  ];

  // ---------- Clubs (from real site) ----------
  const CLUBS = ["Science & Innovation Club", "Literary & Debating Society", "Sports", "Arts & Culture", "ICT & Digital Skills", "Leadership & Service"];

  // ---------- School Sections ----------
  // Nursery & Primary are declared here so they appear in filters/UI, but carry
  // no student records yet — populate SECTIONS[0].classes / SECTIONS[1].classes
  // with real class names and add matching entries to STUDENTS when ready.
  const SECTIONS = [
    { id: "nursery", name: "Nursery Section", classes: [], note: "Not yet populated — data to be added." },
    { id: "primary", name: "Primary Section", classes: [], note: "Not yet populated — data to be added." },
    { id: "junior", name: "Junior Secondary", classes: ["JSS1", "JSS2", "JSS3"], note: null },
    { id: "senior", name: "Senior Secondary", classes: ["SS1", "SS2", "SS3"], note: null }
  ];
  function sectionForClass(cls) {
    const sec = SECTIONS.find(s => s.classes.includes(cls));
    return sec ? sec.name : "Unassigned";
  }

  // ---------- Classes & Subjects (Nigerian curriculum) ----------
  const CLASSES = ["JSS1", "JSS2", "JSS3", "SS1", "SS2", "SS3"];
  const JSS_SUBJECTS = ["Mathematics", "English Language", "Basic Science", "Basic Technology", "Business Studies", "Social Studies", "CRS/IRS", "Agricultural Science", "Computer Studies", "PHE", "CCA", "French"];
  const SS_CORE = ["Mathematics", "English Language", "Civic Education", "Computer Studies"];
  const SS_TRACK_SUBJECTS = {
    Science: ["Biology", "Chemistry", "Physics", "Further Mathematics", "Agricultural Science"],
    Commercial: ["Accounting", "Commerce", "Economics"],
    Arts: ["Literature-in-English", "Government", "CRS/IRS"]
  };
  function subjectsFor(cls, track) {
    if (cls.startsWith("JSS")) return JSS_SUBJECTS;
    return SS_CORE.concat(SS_TRACK_SUBJECTS[track]);
  }

  const GRADE_SCALE = [
    { grade: "A", min: 75, max: 100, label: "Excellent" },
    { grade: "B", min: 65, max: 74, label: "Very Good" },
    { grade: "C", min: 50, max: 64, label: "Credit" },
    { grade: "D", min: 45, max: 49, label: "Pass" },
    { grade: "E", min: 40, max: 44, label: "Pass" },
    { grade: "F", min: 0, max: 39, label: "Fail" }
  ];
  function gradeFor(total) { return GRADE_SCALE.find(g => total >= g.min && total <= g.max).grade; }

  // ---------- Teachers (8) ----------
  const TEACHER_SUBJECTS = ["English Language", "Mathematics", "Civic Education", "Computer Studies", "Biology", "Physics", "Chemistry", "Government"];
  const TEACHERS = TEACHER_SUBJECTS.map((subj, i) => {
    const gender = choice(["M", "F"]);
    const isVP = i === 0; // first teacher doubles as VP (Admin-level)
    const assignedClasses = subj === "Government" || subj === "Biology" || subj === "Physics" || subj === "Chemistry"
      ? shuffle(["SS1", "SS2", "SS3"]).slice(0, 2)
      : shuffle(CLASSES).slice(0, 3);
    return {
      id: `T${i + 1}`,
      staffId: `LRRA/STF/${pad(i + 1, 3)}`,
      name: makeTeacherName(gender),
      gender,
      subject: subj,
      classes: assignedClasses,
      formClass: R() < 0.6 ? choice(assignedClasses) : null,
      role: isVP ? "Vice Principal (Academics) / Teacher" : "Teacher",
      qualification: choice(["B.Sc. Ed.", "B.A. Ed.", "B.Ed.", "PGDE", "M.Ed.", "NCE, B.Sc."]),
      yearsOfService: randInt(1, 9),
      email: null, // filled below
      mobile: null,
      isAdminLevel: isVP
    };
  });
  TEACHERS.forEach(t => {
    const parts = t.name.replace(/^(Mr\.|Mrs\.|Miss)\s/, "").split(" ");
    t.email = `${parts[0].toLowerCase()}.${parts[1].toLowerCase()}@learningrootsroyalacademy.com`;
    t.mobile = `+234 8${randInt(10, 99)} ${randInt(100, 999)} ${randInt(1000, 9999)}`;
  });

  // ---------- Leadership / other staff (for HR directory) ----------
  const LEADERSHIP_STAFF = [
    { id: "L1", staffId: "LRRA/STF/001-A", name: "Alhaji Muazu Raji", gender: "M", role: "Founder / Chairman", qualification: "B.Sc., MBA", yearsOfService: 4, email: "chairman@learningrootsroyalacademy.com", mobile: "+234 816 867 3193" },
    { id: "L2", staffId: "LRRA/STF/002", name: "Mrs. Aishatu Amina", gender: "F", role: "Director", qualification: "M.Ed.", yearsOfService: 4, email: "director@learningrootsroyalacademy.com", mobile: "+234 803 214 5567" },
    { id: "L3", staffId: "LRRA/STF/003", name: "Hajiya Fadimatu Raji", gender: "F", role: "Managing Director", qualification: "B.A., MBA", yearsOfService: 4, email: "md@learningrootsroyalacademy.com", mobile: "+234 807 662 1190" },
    { id: "L4", staffId: "LRRA/STF/004", name: "Mrs. Ooye", gender: "F", role: "Administrator", qualification: "B.Sc. Admin", yearsOfService: 3, email: "administrator@learningrootsroyalacademy.com", mobile: "+234 812 445 7723" },
    { id: "L5", staffId: "LRRA/STF/005", name: "Mrs. Hadiza Nuhu", gender: "F", role: "Assistant Headmistress (Primary)", qualification: "NCE, B.Ed.", yearsOfService: 3, email: "primary.head@learningrootsroyalacademy.com", mobile: "+234 809 331 8842" },
    { id: "L6", staffId: "LRRA/STF/006", name: "Mrs. Comfort Bulus", gender: "F", role: "HR / Digital Officer", qualification: "B.Sc. HRM", yearsOfService: 2, email: "hr@learningrootsroyalacademy.com", mobile: "+234 814 220 9931" },
    { id: "L7", staffId: "LRRA/STF/007", name: "Mr. Yusuf Waziri", gender: "M", role: "Transport Officer", qualification: "OND Logistics", yearsOfService: 2, email: "transport@learningrootsroyalacademy.com", mobile: "+234 806 774 2210" }
  ];

  // ---------- Non-teaching staff (for HR directory realism) ----------
  const NON_TEACHING_ROLES = [
    { role: "Cleaner", dept: "Compound & Facilities", qual: choicePool(["First School Leaving Certificate", "SSCE"]) },
    { role: "Cleaner", dept: "Compound & Facilities", qual: "SSCE" },
    { role: "Cleaner", dept: "Compound & Facilities", qual: "First School Leaving Certificate" },
    { role: "Security Officer", dept: "Security", qual: "SSCE" },
    { role: "Security Officer", dept: "Security", qual: "SSCE" },
    { role: "Front Desk Officer", dept: "Front Office", qual: "OND Office Technology" },
    { role: "Admin Support Officer", dept: "Front Office", qual: "HND Business Administration" },
    { role: "Store Keeper", dept: "Stores & Inventory", qual: "OND Purchasing & Supply" },
    { role: "Kitchen Staff", dept: "Feeding Unit", qual: "SSCE" },
    { role: "Kitchen Staff", dept: "Feeding Unit", qual: "SSCE" },
    { role: "Groundskeeper", dept: "Compound & Facilities", qual: "First School Leaving Certificate" }
  ];
  function choicePool(arr) { return arr[Math.floor(R() * arr.length)]; }
  const NON_TEACHING_STAFF = NON_TEACHING_ROLES.map((r, i) => {
    const gender = choice(["M", "F"]);
    const nameGroup = weightedChoice([["muslim", 55], ["christian", 30], ["igbo", 10], ["yoruba", 5]]);
    let first, surname;
    if (nameGroup === "muslim") { first = gender === "M" ? choice(NAMES.muslimMale) : choice(NAMES.muslimFemale); surname = choice(NAMES.muslimSurname); }
    else if (nameGroup === "christian") { first = gender === "M" ? choice(NAMES.christianMale) : choice(NAMES.christianFemale); surname = choice(NAMES.christianSurname); }
    else if (nameGroup === "igbo") { first = gender === "M" ? choice(NAMES.christianMale) : choice(NAMES.christianFemale); surname = choice(NAMES.igboSurname); }
    else { first = gender === "M" ? choice(NAMES.christianMale) : choice(NAMES.christianFemale); surname = choice(NAMES.yorubaSurname); }
    const title = gender === "M" ? "Mr." : (R() < 0.5 ? "Mrs." : "Miss");
    const name = `${title} ${first} ${surname}`;
    return {
      id: `NT${i + 1}`,
      staffId: `LRRA/STF/${pad(100 + i, 3)}`,
      name, gender, role: r.role, department: r.dept, qualification: r.qual,
      yearsOfService: randInt(1, 7),
      email: `${first.toLowerCase()}.${surname.toLowerCase()}@learningrootsroyalacademy.com`,
      mobile: `+234 8${randInt(10, 99)} ${randInt(100, 999)} ${randInt(1000, 9999)}`,
      classes: []
    };
  });

  // ---------- Users / logins ----------
  const USERS = [
    { username: "admin", password: "admin123", role: "admin", label: "Admin / Vice Principal", refId: "L2" },
    { username: "hr.officer", password: "hr123", role: "hr", label: "HR / Digital Officer", refId: "L6" },
    { username: "transport.officer", password: "transport123", role: "transport", label: "Transport Officer", refId: "L7" }
  ];

  // ---------- Buses / Drivers / Routes ----------
  const ROUTES = ["Girei → School", "Yola Town → School", "Within-Jimeta → School", "Namtari → School", "Jambutu → School"];
  const DRIVERS = ROUTES.map((route, i) => {
    const gender = "M";
    return {
      id: `D${i + 1}`,
      name: makeTeacherName(gender).replace(/^(Mr\.|Mrs\.|Miss)\s/, "Mr. "),
      mobile: `+234 8${randInt(10, 99)} ${randInt(100, 999)} ${randInt(1000, 9999)}`,
      bus: `Bus ${i + 1} (LRRA-0${i + 1})`,
      route,
      stops: shuffle(["Market Stop", "Roundabout Stop", "Estate Gate", "Filling Station Stop", "Junction Stop"]).slice(0, 3),
      arrivalTime: `${randInt(7, 7)}:${choice(["10", "20", "35", "45"])} am`,
      comments: []
    };
  });
  // seed a few realistic transport incident/comment entries
  DRIVERS[0].comments.push(
    { author: "Mr. Yusuf Waziri", role: "Transport Officer", text: "Arrived 15 minutes late on 12 Feb — heavy traffic near the roundabout. Advised driver to leave 10 minutes earlier going forward.", timestamp: "2026-02-12T07:32:00" },
    { author: "Mr. Yusuf Waziri", role: "Transport Officer", text: "Minor tyre issue reported at Estate Gate stop, resolved same morning with spare tyre on board.", timestamp: "2026-03-03T07:15:00" }
  );
  DRIVERS[2].comments.push(
    { author: "Mr. Yusuf Waziri", role: "Transport Officer", text: "Consistent and punctual all through February. No incidents to report.", timestamp: "2026-03-01T08:00:00" }
  );

  // ---------- Job Applications (HR) ----------
  const APPLICATIONS = [
    { id: "APP1", name: "Blessing Okoro", role: "Mathematics Teacher", contact: "+234 803 112 4456", bio: "5 years teaching experience, B.Sc. Mathematics, previously at Federal Government College Yola.", status: "Under Review", date: "2026-02-10" },
    { id: "APP2", name: "Ahmad Suleiman", role: "ICT Instructor", contact: "+234 706 998 2231", bio: "Certified network technician, 3 years corporate IT experience transitioning into teaching.", status: "Shortlisted", date: "2026-02-18" },
    { id: "APP3", name: "Rebecca Vandi", role: "Primary Class Teacher", contact: "+234 815 220 6690", bio: "NCE holder, 4 years lower primary teaching experience in Adamawa State.", status: "Under Review", date: "2026-02-22" },
    { id: "APP4", name: "Ibrahim Garba", role: "Physical & Health Education", contact: "+234 809 442 1187", bio: "Former state athletics coach, interested in coordinating inter-house sports.", status: "Pending", date: "2026-03-01" }
  ];

  // ---------- Comment text banks ----------
  const TEACHER_COMMENT_BANK = [
    "Shows strong improvement in class participation this term.",
    "Needs to submit assignments more promptly — two late submissions this month.",
    "Excellent grasp of the topic; consistently among the top contributors in class discussions.",
    "Struggling slightly with this term's material — recommend extra practice at home.",
    "Very respectful and attentive during lessons.",
    "Has been absent-minded in recent classes; please check in at home.",
    "Outstanding performance in the last continuous assessment.",
    "Would benefit from more consistent revision between lessons."
  ];
  const PARENT_COMMENT_BANK = [
    "Thank you for the update — we will work on this at home.",
    "Please let us know if there are extra materials we should get for revision.",
    "We've noticed the same at home and are following up.",
    "Grateful for the consistent feedback this term.",
    "Is there a specific area we should focus on for extra lessons?",
    "We appreciate the encouragement — it's motivated real effort at home."
  ];
  const ADMIN_TEACHER_COMMENT_BANK = [
    "Please ensure your CA2 scores are submitted by the end of this week.",
    "Noted a pattern of late sign-in this term — kindly regularize.",
    "Lesson plan reviewed and approved — well structured.",
    "Kindly revise the lesson plan to include a clearer assessment section before resubmission.",
    "Good use of practical examples in this term's scheme of work.",
    "Reminder: parent-teacher conference is scheduled for 30 March — please prepare result summaries."
  ];
  const TEACHER_REPLY_BANK = [
    "Understood, will submit by Friday.",
    "Noted, thank you — will adjust going forward.",
    "Thank you for the feedback.",
    "Apologies for the delay, addressing it now.",
    "Will revise and resubmit by tomorrow."
  ];

  function isoWithinTerm(termStart, termEnd, hour) {
    const start = new Date(termStart).getTime();
    const end = new Date(termEnd).getTime();
    const t = start + R() * (end - start);
    const d = new Date(t);
    d.setHours(hour != null ? hour : randInt(7, 16), randInt(0, 59), 0, 0);
    return d.toISOString().slice(0, 19);
  }

  // ---------- Build students ----------
  const CLASS_SIZE_RANGE = [15, 25];
  let studentSeq = 1;
  const STUDENTS = [];
  CLASSES.forEach(cls => {
    const size = randInt(CLASS_SIZE_RANGE[0], CLASS_SIZE_RANGE[1]);
    for (let i = 0; i < size; i++) {
      const gender = choice(["M", "F"]);
      const { name, religion } = makeStudentName(gender);
      const isSS = cls.startsWith("SS");
      const track = isSS ? weightedChoice([["Science", 40], ["Commercial", 35], ["Arts", 25]]) : null;
      const subjects = subjectsFor(cls, track);
      const house = choice(HOUSES).name;
      const club = choice(CLUBS);
      const mode = weightedChoice([["Bus", 55], ["Dropoff", 45]]);
      let transport = null;
      if (mode === "Bus") {
        const d = choice(DRIVERS);
        transport = { mode: "Bus", route: d.route, stop: choice(d.stops), bus: d.bus };
      } else {
        transport = { mode: "Dropoff" };
      }

      // scores per subject
      const scores = {};
      subjects.forEach(subj => {
        const ca1 = randInt(8, 20), ca2 = randInt(8, 20), exam = randInt(20, 60);
        const total = Math.min(100, ca1 + ca2 + exam);
        scores[subj] = {
          ca1, ca2, exam, total, grade: gradeFor(total),
          status: weightedChoice([["Approved", 70], ["Submitted", 20], ["Draft", 10]]),
          vpRemark: R() < 0.25 ? choice(["Well done — keep it up.", "Encourage more practice at home.", "Good improvement from last term."]) : null
        };
      });

      // fee breakdown
      const tuitionTotal = isSS ? 85000 : (cls.startsWith("JSS") ? 70000 : 55000);
      const feedingTotal = 18000;
      const recreationTotal = 6000;
      const emergencyTotal = 4000;
      const transportTotal = mode === "Bus" ? 15000 : 0;
      const feeStatus = weightedChoice([["Paid", 55], ["Partial", 30], ["Unpaid", 15]]);
      function paidAmount(total) {
        if (feeStatus === "Paid") return total;
        if (feeStatus === "Unpaid") return 0;
        return Math.round(total * (0.3 + R() * 0.5));
      }
      const fees = {
        Tuition: { total: tuitionTotal, paid: paidAmount(tuitionTotal) },
        Feeding: { total: feedingTotal, paid: paidAmount(feedingTotal) },
        Recreation: { total: recreationTotal, paid: paidAmount(recreationTotal) },
        "Emergency / First Aid": { total: emergencyTotal, paid: paidAmount(emergencyTotal) }
      };
      if (mode === "Bus") fees["School Transport"] = { total: transportTotal, paid: paidAmount(transportTotal) };
      const grandTotal = Object.values(fees).reduce((s, f) => s + f.total, 0);
      const grandPaid = Object.values(fees).reduce((s, f) => s + f.paid, 0);

      // parent info
      const parentGender = choice(["M", "F"]);
      const parentNameObj = makeTeacherName(parentGender).replace(/^(Mr\.|Mrs\.|Miss)\s/, "");
      const parentTitle = parentGender === "M" ? "Mr." : "Mrs.";
      const surnamePart = name.split(" ")[1];
      const parentName = `${parentTitle} ${parentNameObj.split(" ")[0]} ${surnamePart}`;

      // comments (2-3 mixed authors)
      const term = TERMS.find(t => t.id === CURRENT_TERM_ID);
      const classTeacherObj = choice(TEACHERS.filter(t => t.classes.includes(cls))) || choice(TEACHERS);
      const commentCount = randInt(2, 3);
      const comments = [];
      const authorsPool = shuffle(["teacher", "admin", "parent"]);
      for (let c = 0; c < commentCount; c++) {
        const authorType = authorsPool[c % authorsPool.length];
        let author, role, text;
        if (authorType === "teacher") { author = classTeacherObj.name; role = "Teacher"; text = choice(TEACHER_COMMENT_BANK); }
        else if (authorType === "admin") { author = "Mrs. Aishatu Amina"; role = "Admin"; text = choice(ADMIN_TEACHER_COMMENT_BANK.concat(["Kindly ensure all documents for the term are submitted.", "Good conduct noted during the inter-house event."])); }
        else { author = parentName; role = "Parent"; text = choice(PARENT_COMMENT_BANK); }
        const entry = { author, role, text, timestamp: isoWithinTerm(term.start, term.end) };
        if (R() < 0.5) {
          const replyAuthor = authorType === "parent" ? classTeacherObj.name : parentName;
          const replyRole = authorType === "parent" ? "Teacher" : "Parent";
          entry.reply = { author: replyAuthor, role: replyRole, text: choice(TEACHER_REPLY_BANK.concat(["Thank you for letting us know.", "We'll keep monitoring closely."])), timestamp: isoWithinTerm(term.start, term.end) };
        }
        comments.push(entry);
      }
      comments.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

      // discipline log — only ~12% of students
      const disciplineLog = [];
      if (R() < 0.12) {
        disciplineLog.push({
          date: isoWithinTerm(term.start, term.end).slice(0, 10),
          loggedBy: classTeacherObj.name,
          category: choice(["Late to class", "Uniform violation", "Disruptive behavior", "Missed assignment (repeated)"]),
          note: choice(["Spoken to and warned.", "Parent informed; follow-up planned.", "Resolved after discussion with student."])
        });
      }

      const admissionYear = 2022 + Math.floor((CLASSES.indexOf(cls)) / 2);
      STUDENTS.push({
        id: `LRRA/${admissionYear}/${cls}/${pad(studentSeq, 3)}`,
        name, gender, religion, class: cls, track, house, club, mode: mode,
        age: cls.startsWith("JSS") ? 11 + CLASSES.indexOf(cls) : 14 + (CLASSES.indexOf(cls) - 3),
        avatarSeed: studentSeq,
        subjects, scores,
        transport,
        parent: { name: parentName, mobile: `+234 8${randInt(10, 99)} ${randInt(100, 999)} ${randInt(1000, 9999)}` },
        fees, grandTotal, grandPaid,
        feeStatus,
        comments,
        disciplineLog,
        classTeacher: classTeacherObj.name
      });
      studentSeq++;
    }
  });

  // ---------- Teacher comments (about the teacher, from admin/parent) ----------
  TEACHERS.forEach(t => {
    const term = TERMS.find(x => x.id === CURRENT_TERM_ID);
    const count = randInt(2, 3);
    const comments = [];
    for (let i = 0; i < count; i++) {
      const authorType = choice(["admin", "parent"]);
      let author, role, text;
      if (authorType === "admin") { author = "Mrs. Aishatu Amina"; role = "Admin"; text = choice(ADMIN_TEACHER_COMMENT_BANK); }
      else { author = choice(STUDENTS.filter(s => s.classTeacher === t.name)).parent.name || "A Parent"; role = "Parent"; text = choice(["Thank you for the extra attention given to my child this term.", "Appreciate the detailed feedback on the last test.", "Could we get more regular updates on assignments?"]); }
      const entry = { author, role, text, timestamp: isoWithinTerm(term.start, term.end) };
      if (R() < 0.6) entry.reply = { author: t.name, role: "Teacher", text: choice(TEACHER_REPLY_BANK), timestamp: isoWithinTerm(term.start, term.end) };
      comments.push(entry);
    }
    t.comments = comments.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    // ---- Lesson plans, scheme of work & curriculum ----
    // English Language, Mathematics and Civic Education carry fully worked-out,
    // NERDC-aligned content (3 lesson plans + 3 assignments each) for all 8 teacher
    // subjects, so any teacher account the proprietor opens shows real curriculum
    // depth rather than a generic one-liner.
    const RICH_SUBJECTS = {
      "English Language": {
        schemeNote: "Second Term Scheme of Work — English Language (JSS1–SS3): Wk1 Comprehension & Vocabulary in Context · Wk2 Word Classes / Parts of Speech · Wk3 Tenses & Concord · Wk4 Summary Writing (Note-Making) · Wk5 Letter Writing (Formal & Informal) · Wk6 Figures of Speech · Wk7 Oral English — Vowel & Consonant Sounds · Wk8 Prescribed Prose Study · Wk9 Essay Writing (Narrative/Argumentative) · Wk10 Revision & Mock Continuous Assessment.",
        curricNote: "Strands per the NERDC English Studies curriculum: (1) Listening & Speaking, (2) Reading Comprehension, (3) Grammatical Accuracy & Structure, (4) Writing (Composition, Summary, Official/Informal Letters), (5) Literature-in-English (Prose, Drama, Poetry). WAEC/NECO syllabus objectives are used as the terminal benchmark for SS3.",
        plans: [
          {
            topic: "Comprehension & Summary Writing — Note-Making Techniques",
            cls: "JSS2", status: "Approved",
            vpComment: "Clear structure, good use of a real passage for practice. Approved.",
            content: "Objectives: By the end of the lesson, students should be able to (i) read a given passage silently within a set time, (ii) identify the main and supporting points, (iii) reduce the passage to notes using their own words, not lifted sentences.\nInstructional Materials: A one-page comprehension passage (photocopied), chalkboard/marker, sample note-making format.\nPresentation: Step 1 — Teacher reads the passage aloud once while students follow silently (5 mins). Step 2 — Students read independently and underline key ideas (10 mins). Step 3 — Teacher demonstrates converting one paragraph into short notes on the board. Step 4 — Students attempt the remaining paragraphs in pairs. Step 5 — Selected students read out their notes; class corrects together.\nEvaluation: Students submit their note-made version of the passage; teacher checks for correct reduction (no more than one-third of original length) and absence of copied sentences.\nAssignment: Summarize a second, similar-length passage at home for the next lesson."
          },
          {
            topic: "Tenses and Concord — Subject–Verb Agreement",
            cls: "JSS1", status: "Needs Adjustment",
            vpComment: "The lesson content is good, but the evaluation/assessment section only asks students to 'practice tenses' without a marked exercise or clear success criteria. Please add specific sentences for students to correct, with an answer key, and resubmit.",
            content: "Objectives: Students should be able to (i) identify present, past and future tense forms, (ii) apply correct subject–verb agreement in simple sentences.\nInstructional Materials: Sentence strips, chalkboard.\nPresentation: Teacher introduces tense forms with example sentences, then explains concord rules (singular subject takes singular verb). Students practice orally as a class before written exercises.\nEvaluation: Practice tenses.",
            reuseNote: null
          },
          {
            topic: "Literature-in-English — Analysis of a Prescribed Prose Text",
            cls: "SS1", status: "Pending Review",
            vpComment: null,
            content: "Objectives: Students should be able to (i) identify the theme, setting and major characters of the prescribed prose text, (ii) discuss the author's use of language to develop the plot, (iii) relate the text's central conflict to real-life situations.\nInstructional Materials: Copies of the prescribed text (or relevant chapter excerpts), character-summary handout.\nPresentation: Recap of the previous chapter (5 mins). Guided reading of the assigned chapter in class. Class discussion on the chapter's key events, led by teacher questioning. Group work: each group presents one character's role in the chapter.\nEvaluation: Short written response — 'Discuss one conflict introduced in this chapter and its significance to the story so far' (150 words)."
          }
        ],
        assignments: [
          { title: "Summary Writing — Home Passage Practice", cls: "JSS2", due: "2026-03-13", instructions: "Read the attached passage and reduce it to one-third of its length in your own words. Avoid copying sentences directly from the passage." },
          { title: "Tenses and Concord Worksheet", cls: "JSS1", due: "2026-03-16", instructions: "Correct the 15 sentences on the worksheet, ensuring subject–verb agreement. Show the original error and your correction for each." },
          { title: "Prose Text — Character Study", cls: "SS1", due: "2026-03-20", instructions: "Write a half-page character study of the protagonist in the prescribed text, using at least two direct references from the chapters covered so far." }
        ]
      },
      "Mathematics": {
        schemeNote: "Second Term Scheme of Work — Mathematics (JSS1–SS3): Wk1 Simple Equations & Inequalities · Wk2 Fractions, Decimals & Approximation · Wk3 Basic Mensuration (Area & Perimeter) · Wk4 Simultaneous Linear Equations (SS) · Wk5 Quadratic Equations by Factorization (SS) · Wk6 Angles & Polygon Properties · Wk7 Ratio, Proportion & Rates · Wk8 Statistics — Mean, Median, Mode · Wk9 Introduction to Trigonometric Ratios (SS) · Wk10 Revision & Mock Continuous Assessment.",
        curricNote: "Strands per the NERDC Mathematics curriculum: (1) Number & Numeration, (2) Algebraic Processes, (3) Geometry & Mensuration, (4) Statistics & Probability, (5) Trigonometry (SS only). Progression from JSS to SS follows the WAEC/NECO core-maths syllabus so senior students are exam-ready by SS3.",
        plans: [
          {
            topic: "Simultaneous Linear Equations — Elimination Method",
            cls: "SS1", status: "Approved",
            vpComment: "Well-paced, worked examples build logically. Good choice of evaluation questions. Approved.",
            content: "Objectives: Students should be able to (i) set up two linear equations from a given word problem, (ii) solve for both unknowns using the elimination method, (iii) verify their solution by substitution.\nInstructional Materials: Chalkboard, worked-example handout, past WAEC-style question.\nPresentation: Step 1 — Recap solving a single linear equation (5 mins). Step 2 — Introduce a real-life word problem requiring two unknowns (e.g. cost of pens and pencils). Step 3 — Demonstrate elimination method on the board, showing how to align coefficients. Step 4 — Students solve two guided examples in pairs. Step 5 — One pair presents their working on the board.\nEvaluation: Solve: 2x + 3y = 12 and x − y = 1, showing all working, then verify by substitution."
          },
          {
            topic: "Quadratic Equations by Factorization",
            cls: "SS2", status: "Needs Adjustment",
            vpComment: "The method shown only covers equations that factorize neatly (a=1). Senior students will meet harder cases in WAEC. Please add at least one example with a≠1, and include a proper evaluation exercise rather than 'more practice questions'.",
            content: "Objectives: Students should be able to (i) express a quadratic expression in factorized form, (ii) solve for the roots of a quadratic equation, (iii) check solutions by substitution.\nInstructional Materials: Chalkboard, factorization flow-chart handout.\nPresentation: Review of expansion of two binomials. Teacher demonstrates factorizing x² + 5x + 6 = 0 step by step. Students attempt two similar examples independently.\nEvaluation: More practice questions.",
            reuseNote: "Reusing this plan for the second SS2 stream — several students in the first group struggled to factorize expressions where the coefficient of x² was not 1."
          },
          {
            topic: "Basic Mensuration — Area and Perimeter of Plane Shapes",
            cls: "JSS2", status: "Pending Review",
            vpComment: null,
            content: "Objectives: Students should be able to (i) state the formulae for area and perimeter of rectangles, triangles and circles, (ii) apply the formulae to solve real-world problems, (iii) convert between related units where necessary.\nInstructional Materials: Cut-out shapes (rectangle, triangle, circle), measuring tape, chalkboard.\nPresentation: Teacher displays cut-out shapes and reviews their properties. Class derives the area formula for a rectangle by counting unit squares. Teacher introduces the triangle and circle formulae with worked examples. Students measure a real object in the classroom (e.g. the door) and calculate its area.\nEvaluation: A school football field is 100m long and 60m wide. Calculate its area and the total distance around it (perimeter)."
          }
        ],
        assignments: [
          { title: "Simultaneous Equations — Word Problems", cls: "SS1", due: "2026-03-14", instructions: "Solve the 5 word problems on the worksheet using the elimination method. Show all working and verify each answer by substitution." },
          { title: "Factorizing Quadratics Practice", cls: "SS2", due: "2026-03-17", instructions: "Factorize and solve all 10 quadratic equations, including the 4 where the coefficient of x² is greater than 1." },
          { title: "Mensuration — Measuring at Home", cls: "JSS2", due: "2026-03-21", instructions: "Measure the length and width of one room in your house and calculate its area and perimeter. Bring your measurements and working to class." }
        ]
      },
      "Civic Education": {
        schemeNote: "Second Term Scheme of Work — Civic Education (JSS1–SS3): Wk1 Meaning and Types of Citizenship · Wk2 Rights and Duties of a Citizen · Wk3 Democracy and Democratic Institutions · Wk4 Rule of Law and Due Process · Wk5 Corruption — Causes, Effects and Prevention · Wk6 National Values and Ethical Orientation · Wk7 Civic Responsibility and National Development · Wk8 Human Trafficking and Child Rights Abuse · Wk9 Nigeria's Constitution — An Overview · Wk10 Revision & Mock Continuous Assessment.",
        curricNote: "Strands per the NERDC Civic Education curriculum: (1) Citizenship & National Consciousness, (2) Human Rights & Rule of Law, (3) Democracy & Government, (4) Social Values, (5) Constitutional Rights & Duties. Content is scaffolded so JSS focuses on personal/community civic duty, while SS extends into constitutional and institutional analysis.",
        plans: [
          {
            topic: "Fundamental Human Rights Under the Nigerian Constitution",
            cls: "JSS3", status: "Approved",
            vpComment: "Good use of real-life scenarios to make rights relatable. Approved.",
            content: "Objectives: Students should be able to (i) list at least five fundamental human rights guaranteed by the Nigerian Constitution, (ii) explain the meaning of each right in simple terms, (iii) identify situations where a right has been violated.\nInstructional Materials: Simplified excerpt of Chapter IV of the 1999 Constitution, scenario cards.\nPresentation: Teacher introduces the concept of a 'right' versus a 'privilege'. Class reads through five key rights (life, dignity, personal liberty, fair hearing, freedom of expression) with everyday examples. Students work in groups analyzing scenario cards to decide which right, if any, is being violated.\nEvaluation: Give two examples of situations from your own community where a person's right to fair hearing might be denied, and explain why it matters."
          },
          {
            topic: "Rule of Law and Due Process",
            cls: "SS1", status: "Needs Adjustment",
            vpComment: "The definition of 'rule of law' given is too brief for SS1 and doesn't distinguish it from 'rule by law'. Please expand the explanation with a Nigerian example (e.g. a court case or constitutional provision) and add a proper evaluation question — 'discuss' alone isn't specific enough to grade fairly.",
            content: "Objectives: Students should be able to (i) define the rule of law, (ii) explain due process, (iii) relate both concepts to Nigeria's justice system.\nInstructional Materials: Chalkboard, newspaper clipping on a court matter (optional).\nPresentation: Teacher defines rule of law as 'no one is above the law'. Brief discussion on due process meaning fair legal procedure. Class discusses why these matter in a democracy.\nEvaluation: Discuss rule of law.",
            reuseNote: null
          },
          {
            topic: "Civic Responsibility and National Development",
            cls: "JSS2", status: "Pending Review",
            vpComment: null,
            content: "Objectives: Students should be able to (i) identify their civic responsibilities as young Nigerians, (ii) explain how individual responsibility contributes to national development, (iii) propose one civic action they can take in their own community.\nInstructional Materials: Chalkboard, examples of community civic projects (posters/pictures if available).\nPresentation: Teacher opens with the question 'What does it mean to be a responsible citizen?' Class brainstorms responsibilities (obeying laws, paying taxes when older, voting, keeping the environment clean, respecting others' rights). Teacher links these to national development using a simple cause-effect chain. Students design a one-sentence 'civic pledge' for their class.\nEvaluation: Write two civic responsibilities you can practice this term as a student, and explain how each one helps your community."
          }
        ],
        assignments: [
          { title: "Rights and Scenarios Worksheet", cls: "JSS3", due: "2026-03-13", instructions: "For each of the 5 scenarios given, name the human right involved and explain briefly whether it was respected or violated." },
          { title: "Rule of Law — Short Essay", cls: "SS1", due: "2026-03-18", instructions: "In half a page, explain the difference between 'rule of law' and 'rule by law', using one Nigerian example to support your answer." },
          { title: "My Civic Pledge Poster", cls: "JSS2", due: "2026-03-22", instructions: "Design a simple poster showing three civic responsibilities you commit to this term. Bring it to class for display on the notice board." }
        ]
      },
      "Computer Studies": {
        schemeNote: "Second Term Scheme of Work — Computer Studies (JSS1–SS3): Wk1 Computer Hardware & Software · Wk2 The Operating System & File Management · Wk3 Introduction to the Internet & Email · Wk4 Word Processing — Formatting & Mail Merge · Wk5 Spreadsheet Basics — Formulas & Charts · Wk6 Introduction to Algorithms & Flowcharts · Wk7 Basic Programming Concepts · Wk8 Computer Ethics & Cyber Safety · Wk9 Database Concepts — Introduction · Wk10 Revision & Mock Continuous Assessment.",
        curricNote: "Strands per the NERDC Computer Studies curriculum: (1) Computer Fundamentals (Hardware/Software), (2) Application Packages (Word Processing, Spreadsheet, Presentation), (3) The Internet & Networking, (4) Introduction to Programming, (5) Computer Ethics & Safety. Practical sessions run alongside theory each week in the ICT lab.",
        plans: [
          {
            topic: "Introduction to Spreadsheets — Formulas and Basic Functions",
            cls: "JSS3", status: "Approved",
            vpComment: "Good balance of demonstration and hands-on practice on the lab computers. Approved.",
            content: "Objectives: Students should be able to (i) identify the parts of a spreadsheet (cells, rows, columns), (ii) enter data and apply a simple formula, (iii) use the SUM and AVERAGE functions.\nInstructional Materials: Lab computers, projector, sample result-sheet template.\nPresentation: Step 1 — Teacher reviews spreadsheet layout on the projector (5 mins). Step 2 — Demonstrates entering scores and writing a SUM formula. Step 3 — Students open the template on their own computers and enter sample data. Step 4 — Students apply SUM and AVERAGE to their own entries. Step 5 — Selected students display their result on the projector.\nEvaluation: Using the given scores for 10 students, calculate each student's total and average using formulas, not manual addition."
          },
          {
            topic: "Flowcharts and Algorithm Design",
            cls: "SS1", status: "Needs Adjustment",
            vpComment: "Good introduction, but the evaluation section just says 'draw a flowchart' with no problem given. Please attach a specific everyday task (e.g. making tea) for students to flowchart, with the expected symbols shown, and resubmit.",
            content: "Objectives: Students should be able to (i) explain what an algorithm is, (ii) identify standard flowchart symbols, (iii) represent a simple everyday process as a flowchart.\nInstructional Materials: Flowchart symbol chart, chalkboard.\nPresentation: Teacher explains algorithms using a real-life example (steps to make tea). Introduces flowchart symbols (start/end, process, decision, input/output). Class builds the tea-making flowchart together on the board.\nEvaluation: Draw a flowchart."
          },
          {
            topic: "Internet Safety and Digital Citizenship",
            cls: "JSS2", status: "Pending Review",
            vpComment: null,
            content: "Objectives: Students should be able to (i) list common online dangers (phishing, cyberbullying, sharing personal information), (ii) explain safe practices when using the internet, (iii) demonstrate responsible online behaviour.\nInstructional Materials: Projector, short internet-safety video/handout, discussion scenario cards.\nPresentation: Teacher opens with a short scenario about a stranger messaging a student online. Class discusses what could go wrong. Teacher introduces the key rules of digital citizenship. Students work in pairs to review scenario cards and decide the safe response.\nEvaluation: Write three rules you will personally follow to stay safe online, and explain why each one matters."
          }
        ],
        assignments: [
          { title: "Spreadsheet Practical — Class Result Sheet", cls: "JSS3", due: "2026-03-13", instructions: "Using the lab computer, enter the given scores for 10 subjects and use formulas to calculate each student's total and average." },
          { title: "Flowchart Design Worksheet", cls: "SS1", due: "2026-03-17", instructions: "Draw a flowchart for the process of registering for an exam at school, using the correct standard symbols." },
          { title: "My Digital Citizenship Pledge", cls: "JSS2", due: "2026-03-20", instructions: "Write and illustrate three personal rules for staying safe online, to be displayed on the ICT lab notice board." }
        ]
      },
      "Biology": {
        schemeNote: "Second Term Scheme of Work — Biology (SS1–SS3): Wk1 Cell Structure and Function · Wk2 Classification of Living Things · Wk3 Nutrition in Plants (Photosynthesis) · Wk4 Nutrition in Animals · Wk5 Transport Systems in Plants and Animals · Wk6 Respiration · Wk7 Excretion · Wk8 Reproduction in Plants · Wk9 Ecology — Ecosystems and Habitats · Wk10 Revision & Mock Continuous Assessment.",
        curricNote: "Strands per the NERDC Biology curriculum: (1) Living Things and their Environment, (2) Nutrition, (3) Transport & Respiration, (4) Reproduction and Growth, (5) Ecology. WAEC/NECO practical skills (specimen drawing, dissection technique, use of the microscope) are emphasised from SS2 onward.",
        plans: [
          {
            topic: "Photosynthesis — Factors Affecting the Rate of Photosynthesis",
            cls: "SS1", status: "Approved",
            vpComment: "Strong practical demonstration with the starch test. Approved.",
            content: "Objectives: Students should be able to (i) state the word equation for photosynthesis, (ii) identify the factors that affect its rate (light, CO₂, temperature, water), (iii) test a leaf for the presence of starch.\nInstructional Materials: A variegated leaf, iodine solution, methylated spirit, beaker, Bunsen burner, boiling water.\nPresentation: Step 1 — Recap the word equation on the board (5 mins). Step 2 — Teacher explains each limiting factor with everyday examples. Step 3 — Class practical: decolourise and iodine-test the leaf as a demonstration. Step 4 — Students record observations and relate the result to the presence of chlorophyll and light. Step 5 — Class discussion on why the un-green part of the leaf shows no starch.\nEvaluation: Explain, using the practical result, why sunlight is essential for starch production in green plants."
          },
          {
            topic: "The Human Circulatory System — Structure of the Heart",
            cls: "SS2", status: "Needs Adjustment",
            vpComment: "The diagram work is good, but the evaluation only asks students to 'label the heart' without checking they understand blood flow direction. Please add a question on the path of blood through the chambers, and resubmit.",
            content: "Objectives: Students should be able to (i) identify the main chambers and valves of the heart, (ii) trace the path of blood through the heart, (iii) relate heart structure to its function as a pump.\nInstructional Materials: Heart model or large diagram, chalkboard.\nPresentation: Teacher displays the heart diagram and names each chamber. Class traces blood flow from the vena cava through to the aorta as a group. Students copy and label a blank heart diagram.\nEvaluation: Label the heart.",
            reuseNote: "Reusing this plan for the second SS2 stream — many students in the first group could label the chambers but could not correctly trace the direction of blood flow."
          },
          {
            topic: "Ecosystems and Energy Flow — Food Chains and Food Webs",
            cls: "SS1", status: "Pending Review",
            vpComment: null,
            content: "Objectives: Students should be able to (i) define ecosystem, habitat and food chain, (ii) construct a simple food chain from given organisms, (iii) explain the direction of energy flow within a food web.\nInstructional Materials: Picture cards of local organisms (grass, grasshopper, lizard, hawk), chalkboard.\nPresentation: Teacher introduces key terms using the school garden as a real example. Class arranges picture cards into a correct food chain on the board. Teacher extends this into a food web by linking several chains together. Students identify producers, consumers and decomposers in the web.\nEvaluation: Using the organisms provided, construct one food chain and explain what would happen to the population of grasshoppers if all the lizards were removed."
          }
        ],
        assignments: [
          { title: "Practical Report — Testing a Leaf for Starch", cls: "SS1", due: "2026-03-13", instructions: "Write up the starch-test practical in the standard format: Aim, Materials, Method, Observation, Conclusion." },
          { title: "Labelled Diagram — The Human Heart", cls: "SS2", due: "2026-03-17", instructions: "Draw and label a large diagram of the heart, and use arrows to show the correct path of blood through the four chambers." },
          { title: "Food Web Construction", cls: "SS1", due: "2026-03-21", instructions: "Using at least six organisms found around the school compound, construct a food web and identify one producer, consumer and decomposer." }
        ]
      },
      "Physics": {
        schemeNote: "Second Term Scheme of Work — Physics (SS1–SS3): Wk1 Measurement and Units · Wk2 Motion — Speed, Velocity, Acceleration · Wk3 Newton's Laws of Motion · Wk4 Work, Energy and Power · Wk5 Simple Machines · Wk6 Heat Energy and Temperature · Wk7 Waves — Properties of Waves · Wk8 Reflection and Refraction of Light · Wk9 Current Electricity — Ohm's Law · Wk10 Revision & Mock Continuous Assessment.",
        curricNote: "Strands per the NERDC Physics curriculum: (1) Mechanics, (2) Thermal Physics, (3) Waves & Optics, (4) Electricity & Magnetism, (5) Practical Physics and measurement skills — aligned to the WAEC/NECO core-physics syllabus with emphasis on calculation and lab technique.",
        plans: [
          {
            topic: "Newton's Laws of Motion — Practical Applications",
            cls: "SS2", status: "Approved",
            vpComment: "Good use of everyday examples (bus braking, seatbelts) to ground the theory. Approved.",
            content: "Objectives: Students should be able to (i) state Newton's three laws of motion, (ii) give real-life examples of each law, (iii) solve a simple calculation using F = ma.\nInstructional Materials: Trolley and weights for demonstration, chalkboard.\nPresentation: Step 1 — Teacher demonstrates inertia by trying to move a loaded trolley versus an empty one (5 mins). Step 2 — States and explains each law with the trolley demonstration and everyday examples (a moving bus stopping suddenly, rocket propulsion). Step 3 — Worked example applying F = ma. Step 4 — Students attempt two similar calculations in pairs. Step 5 — Review answers as a class.\nEvaluation: A force of 20N acts on a 4kg object. Calculate its acceleration, and state which of Newton's laws applies."
          },
          {
            topic: "Ohm's Law and Simple Circuits",
            cls: "SS1", status: "Needs Adjustment",
            vpComment: "The circuit diagrams are clear, but the evaluation just says 'solve for current' without giving actual values. Please attach a specific circuit with resistance and voltage values and resubmit.",
            content: "Objectives: Students should be able to (i) state Ohm's Law, (ii) identify series and parallel circuit connections, (iii) calculate current, voltage or resistance given the other two.\nInstructional Materials: Simple circuit kit (battery, bulb, wires, ammeter), chalkboard.\nPresentation: Teacher demonstrates a simple circuit with the kit. Introduces V = IR with a worked example. Class practices drawing series and parallel circuit diagrams.\nEvaluation: Solve for current."
          },
          {
            topic: "Reflection of Light — Laws of Reflection Using a Plane Mirror",
            cls: "SS1", status: "Pending Review",
            vpComment: null,
            content: "Objectives: Students should be able to (i) state the two laws of reflection, (ii) draw a correct ray diagram showing incident and reflected rays, (iii) verify the laws using a plane mirror practical.\nInstructional Materials: Plane mirror, protractor, pins, drawing board, ray-box (if available).\nPresentation: Teacher introduces key terms (normal, angle of incidence, angle of reflection). Demonstrates the pin-and-mirror method to trace a ray path. Students carry out the practical in pairs, measuring both angles. Class compares results to confirm the laws of reflection.\nEvaluation: Using your practical results, state the relationship you observed between the angle of incidence and the angle of reflection, and draw one labelled ray diagram to illustrate it."
          }
        ],
        assignments: [
          { title: "Problem Set — Newton's Second Law Calculations", cls: "SS2", due: "2026-03-14", instructions: "Solve the 5 F = ma problems on the worksheet, showing all working and correct units." },
          { title: "Circuit Diagram Practice — Series and Parallel", cls: "SS1", due: "2026-03-18", instructions: "Draw one series and one parallel circuit using the given components, and calculate the total resistance for each." },
          { title: "Ray Diagram — Reflection in a Plane Mirror", cls: "SS1", due: "2026-03-21", instructions: "Draw a labelled ray diagram showing an incident ray striking a plane mirror at 40°, and mark the angle of reflection." }
        ]
      },
      "Chemistry": {
        schemeNote: "Second Term Scheme of Work — Chemistry (SS1–SS3): Wk1 Matter and its States · Wk2 Atomic Structure · Wk3 The Periodic Table · Wk4 Chemical Bonding · Wk5 Acids, Bases and Salts · Wk6 Chemical Reactions and Equations · Wk7 The Mole Concept · Wk8 Separation Techniques · Wk9 Air and Combustion · Wk10 Revision & Mock Continuous Assessment.",
        curricNote: "Strands per the NERDC Chemistry curriculum: (1) Matter & Atomic Structure, (2) The Periodic Table & Bonding, (3) Acids, Bases and Salts, (4) Quantitative Chemistry (Mole Concept), (5) Practical Chemistry — aligned to the WAEC/NECO core-chemistry syllabus with strict lab-safety procedure.",
        plans: [
          {
            topic: "Acids, Bases and Salts — Testing with Indicators",
            cls: "SS2", status: "Approved",
            vpComment: "Practical was well supervised, safety instructions given before handling the acids. Approved.",
            content: "Objectives: Students should be able to (i) distinguish between acids, bases and salts using their properties, (ii) use litmus and universal indicator to classify given substances, (iii) observe basic safety precautions when handling acids.\nInstructional Materials: Dilute acid and base samples, litmus paper, universal indicator, test tubes, safety goggles.\nPresentation: Step 1 — Safety briefing before any handling begins (5 mins). Step 2 — Teacher explains the pH scale and indicator colour changes. Step 3 — Demonstrates testing one sample. Step 4 — Students test the remaining samples in supervised pairs and record colour changes. Step 5 — Class compares results and classifies each sample.\nEvaluation: From your results, classify each of the four tested substances as acidic, basic or neutral, and explain the indicator evidence for your answer."
          },
          {
            topic: "The Periodic Table — Trends in Groups and Periods",
            cls: "SS1", status: "Needs Adjustment",
            vpComment: "Good coverage of group properties, but the evaluation only asks students to 'describe the periodic table' with no specific elements to compare. Please add a question comparing two named elements and resubmit.",
            content: "Objectives: Students should be able to (i) describe how elements are arranged in the periodic table, (ii) identify trends in atomic size and reactivity across a period and down a group, (iii) locate a given element's group and period.\nInstructional Materials: Wall chart of the periodic table, chalkboard.\nPresentation: Teacher reviews the arrangement by atomic number. Explains group and period trends using Group I (alkali metals) as an example. Students locate and record the group/period of five given elements.\nEvaluation: Describe the periodic table."
          },
          {
            topic: "The Mole Concept — Introduction to Molar Mass",
            cls: "SS3", status: "Pending Review",
            vpComment: null,
            content: "Objectives: Students should be able to (i) define the mole and Avogadro's number, (ii) calculate the molar mass of a given compound, (iii) convert between mass, moles and number of particles.\nInstructional Materials: Periodic table wall chart, chalkboard, calculators.\nPresentation: Teacher introduces the mole as a 'chemist's counting unit', linking it to Avogadro's number. Demonstrates calculating the molar mass of water and sodium chloride step by step. Students calculate the molar mass of two further compounds independently.\nEvaluation: Calculate the molar mass of calcium carbonate (CaCO₃) and determine the number of moles in 50g of the compound."
          }
        ],
        assignments: [
          { title: "Practical Report — Acid-Base Indicator Test", cls: "SS2", due: "2026-03-13", instructions: "Write up the indicator-test practical in the standard format, including a table of your observed colour changes and final classification for each sample." },
          { title: "Periodic Trends Worksheet", cls: "SS1", due: "2026-03-17", instructions: "For the five given elements, state their group, period, and compare their reactivity based on periodic trends." },
          { title: "Mole Concept Calculations", cls: "SS3", due: "2026-03-21", instructions: "Solve the 6 molar-mass and mole-conversion problems on the worksheet, showing all working." }
        ]
      },
      "Government": {
        schemeNote: "Second Term Scheme of Work — Government (SS1–SS3): Wk1 Meaning and Scope of Government · Wk2 Forms of Government · Wk3 Arms of Government — Separation of Powers · Wk4 The Nigerian Constitution · Wk5 Political Parties and Pressure Groups · Wk6 The Electoral Process in Nigeria · Wk7 Federalism in Nigeria · Wk8 Public Administration and the Civil Service · Wk9 International Relations and Nigeria's Foreign Policy · Wk10 Revision & Mock Continuous Assessment.",
        curricNote: "Strands per the NERDC Government curriculum: (1) Basic Concepts and Forms of Government, (2) The Nigerian Constitution, (3) Political Institutions and Processes, (4) Public Administration, (5) International Relations — aligned to the WAEC/NECO core-government syllabus for SS3 exam readiness.",
        plans: [
          {
            topic: "Separation of Powers — The Three Arms of Government",
            cls: "SS2", status: "Approved",
            vpComment: "Clear use of the Nigerian structure (Executive, Legislature, Judiciary) with current examples. Approved.",
            content: "Objectives: Students should be able to (i) name the three arms of government, (ii) explain the function of each arm, (iii) explain why separation of powers matters for checks and balances.\nInstructional Materials: Chart showing the structure of Nigeria's federal government, chalkboard.\nPresentation: Step 1 — Teacher asks students to name who makes, enforces and interprets laws (5 mins). Step 2 — Introduces the Executive, Legislature and Judiciary with their specific functions. Step 3 — Discusses a real example of one arm checking another (e.g. National Assembly approving the budget). Step 4 — Students complete a matching exercise linking each arm to its function. Step 5 — Class discussion on what could go wrong if one arm had all the power.\nEvaluation: Explain, with one Nigerian example, how the Legislature checks the power of the Executive."
          },
          {
            topic: "The Electoral Process in Nigeria",
            cls: "SS3", status: "Needs Adjustment",
            vpComment: "Good coverage of INEC's role, but the evaluation section only says 'discuss elections' with no specific focus. Please narrow it to one stage of the process (e.g. voter registration or collation) and resubmit.",
            content: "Objectives: Students should be able to (i) outline the stages of an election in Nigeria, (ii) explain the role of INEC, (iii) identify common challenges to free and fair elections.\nInstructional Materials: Chalkboard, sample voter's card image/handout.\nPresentation: Teacher outlines the stages: registration, campaign, voting, collation, declaration of results. Explains INEC's role at each stage. Class discusses challenges such as vote-buying and violence.\nEvaluation: Discuss elections."
          },
          {
            topic: "Federalism — Nigeria's Federal Structure",
            cls: "SS1", status: "Pending Review",
            vpComment: null,
            content: "Objectives: Students should be able to (i) define federalism, (ii) describe how power is shared between federal, state and local governments in Nigeria, (iii) give an example of a matter handled at each level.\nInstructional Materials: Chart showing the three tiers of government, chalkboard.\nPresentation: Teacher introduces federalism by contrasting it with a unitary system. Uses the exclusive, concurrent and residual legislative lists to show how responsibilities are divided. Students sort given examples (e.g. defence, primary education, local roads) into the correct tier.\nEvaluation: State one function each of the federal, state and local government, and explain why education mostly falls under the concurrent list."
          }
        ],
        assignments: [
          { title: "Case Study — Checks and Balances in Nigeria", cls: "SS2", due: "2026-03-13", instructions: "Find one recent example of the National Assembly or Judiciary checking the Executive, and write a half-page summary of what happened and why it matters." },
          { title: "Electoral Process Timeline", cls: "SS3", due: "2026-03-17", instructions: "Draw a timeline showing the stages of a Nigerian general election, from voter registration to declaration of results." },
          { title: "Federalism Comparison Chart", cls: "SS1", due: "2026-03-20", instructions: "Create a three-column chart listing two responsibilities each for the federal, state and local government." }
        ]
      }
    };

    const rich = RICH_SUBJECTS[t.subject];
    if (rich) {
      t.lessonPlans = rich.plans.map((p, idx) => ({
        id: `${t.id}-LP${idx + 1}`, class: p.cls, topic: p.topic, status: p.status,
        vpComment: p.vpComment || null, reuseNote: p.reuseNote || null, content: p.content
      }));
      t.assignments = rich.assignments.map((a, idx) => ({ id: `${t.id}-ASG${idx + 1}`, cls: a.cls, title: a.title, due: a.due, instructions: a.instructions }));
      t.schemeOfWork = { status: "Submitted — Second Term", note: rich.schemeNote };
      t.curriculum = { status: "Reference: Nigerian National Curriculum (NERDC)", note: rich.curricNote };
    } else {
      // lighter placeholder pattern for the remaining five subjects
      t.lessonPlans = [
        { id: `${t.id}-LP1`, class: t.classes[0], topic: `Introduction to ${t.subject} — Term Overview`, status: "Approved", vpComment: "Well structured, clear objectives.", reuseNote: null, content: `Week 1–2 scheme covering foundational concepts in ${t.subject} for ${t.classes[0]}.` },
        { id: `${t.id}-LP2`, class: t.classes[1] || t.classes[0], topic: `${t.subject} — Continuous Assessment Prep`, status: R() < 0.5 ? "Pending Review" : "Needs Adjustment", vpComment: R() < 0.5 ? null : "Please add a clearer assessment/evaluation section before resubmission.", reuseNote: R() < 0.4 ? "Reusing this plan for the second stream — some students had not fully grasped the topic in the first pass." : null, content: `Revision-focused lesson plan ahead of CA2 for ${t.subject}.` }
      ];
      t.assignments = [];
      t.schemeOfWork = { status: "Not yet uploaded", note: "Teacher to upload scheme of work for this term." };
      t.curriculum = { status: "Reference: Nigerian National Curriculum", note: "Detailed breakdown to be added by teacher." };
    }

    // attendance clock-in log (Admin/VP view only)
    const attendanceLog = [];
    const days = 10;
    for (let d = 0; d < days; d++) {
      const date = new Date(2026, 1, 2 + d);
      if (date.getDay() === 0 || date.getDay() === 6) continue;
      const late = R() < 0.15;
      const hour = late ? randInt(8, 9) : 7;
      const minute = late ? randInt(0, 59) : randInt(15, 59);
      attendanceLog.push({
        date: date.toISOString().slice(0, 10),
        time: `${pad(hour, 2)}:${pad(minute, 2)}`,
        status: late ? "Late" : "On Time",
        note: late ? "Reported to VP before signing in, as required." : null
      });
    }
    t.attendanceLog = attendanceLog;
    t.daysLateThisTerm = attendanceLog.filter(a => a.status === "Late").length;

    // demo login for each teacher
    const uname = t.name.replace(/^(Mr\.|Mrs\.|Miss)\s/, "").split(" ")[1].toLowerCase() + "." + t.id.toLowerCase();
    USERS.push({ username: uname, password: "teach123", role: "teacher", label: t.name, refId: t.id });
  });

  // one demo parent login mapped to first student with a parent, for convenience
  // (parents use their own personal email in the real system — never a school-issued one —
  // so the demo username mirrors a realistic personal Gmail address)
  const demoParentStudent = STUDENTS[0];
  const demoParentUname = demoParentStudent.parent.name.replace(/^(Mr\.|Mrs\.)\s/, "").toLowerCase().replace(/\s+/g, ".") + "@gmail.com";
  USERS.push({ username: demoParentUname, password: "parent123", role: "parent", label: `${demoParentStudent.parent.name} (parent of ${demoParentStudent.name})`, refId: demoParentStudent.id });

  // ---------- Announcements ----------
  const ANNOUNCEMENTS = [
    { date: "2026-03-25", title: "Parent-Teacher Conference — 30 March", audience: "All Parents", body: "All parents are invited to review Second Term results with class teachers. Time slots will be shared via WhatsApp." },
    { date: "2026-03-10", title: "Music & Dancing Festival Results", audience: "All", body: "Congratulations to Green House for winning this term's Inter-House Music & Dancing Festival." },
    { date: "2026-02-20", title: "Second Term Fee Reminder", audience: "Parents with Outstanding Balance", body: "Kindly complete outstanding Second Term fee balances before the mid-term break." },
    { date: "2026-01-05", title: "Welcome Back — Second Term", audience: "All", body: "We welcome all students and staff back for the Second Term. Full calendar has been shared." }
  ];

  // ---------- Finance / Account Department ----------
  // Salaries are computed from qualification tier + years of service so figures
  // feel earned rather than arbitrary — better qualification and longer service
  // both push pay up, consistent with how Nigerian private schools typically scale pay.
  function qualTier(q) {
    if (/M\.Ed|MBA|M\.A|PGDE/.test(q)) return 3;
    if (/B\.Sc|B\.A\.|B\.Ed|HND/.test(q)) return 2;
    return 1; // NCE, OND, SSCE, First School Leaving Certificate
  }
  function computeSalary(qual, years, opts) {
    opts = opts || {};
    const tier = qualTier(qual);
    let base = (opts.base != null ? opts.base : 55000) + tier * 15000;
    base += Math.min(years, 12) * 3200;
    if (opts.adminLevel) base += 45000;
    return Math.round(base / 500) * 500;
  }
  TEACHERS.forEach(t => { t.monthlySalary = computeSalary(t.qualification, t.yearsOfService, { adminLevel: t.isAdminLevel }); });
  const LEADERSHIP_BASE = { "Founder / Chairman": 260000, "Director": 220000, "Managing Director": 205000, "Administrator": 120000, "Assistant Headmistress (Primary)": 130000, "HR / Digital Officer": 95000, "Transport Officer": 75000 };
  LEADERSHIP_STAFF.forEach(l => { l.monthlySalary = LEADERSHIP_BASE[l.role] || computeSalary(l.qualification, l.yearsOfService, { base: 90000 }); });
  NON_TEACHING_STAFF.forEach(n => { n.monthlySalary = computeSalary(n.qualification, n.yearsOfService, { base: 22000 }); });

  const PAYROLL_STAFF = TEACHERS.map(t => ({ id: t.id, name: t.name, department: "Teaching", role: t.role, qualification: t.qualification, yearsOfService: t.yearsOfService, monthlySalary: t.monthlySalary }))
    .concat(LEADERSHIP_STAFF.map(l => ({ id: l.id, name: l.name, department: "Leadership", role: l.role, qualification: l.qualification, yearsOfService: l.yearsOfService, monthlySalary: l.monthlySalary })))
    .concat(NON_TEACHING_STAFF.map(n => ({ id: n.id, name: n.name, department: n.department, role: n.role, qualification: n.qualification, yearsOfService: n.yearsOfService, monthlySalary: n.monthlySalary })));
  const TOTAL_MONTHLY_PAYROLL = PAYROLL_STAFF.reduce((s, p) => s + p.monthlySalary, 0);

  // Expenses — realistic operational costs logged across the current term
  const EXPENSES = [
    { id: "EXP1", date: "2026-01-08", category: "Fuel & Vehicle Maintenance", description: "Diesel top-up for 5 school buses", amount: 145000 },
    { id: "EXP2", date: "2026-01-15", category: "Instructional Materials", description: "Textbooks and workbooks — JSS classes", amount: 210000 },
    { id: "EXP3", date: "2026-01-20", category: "Utilities", description: "Generator diesel and electricity bill", amount: 95000 },
    { id: "EXP4", date: "2026-01-27", category: "Feeding Supplies", description: "Foodstuff restock for feeding unit", amount: 180000 },
    { id: "EXP5", date: "2026-02-03", category: "Fuel & Vehicle Maintenance", description: "Bus 2 tyre replacement (2 tyres)", amount: 86000 },
    { id: "EXP6", date: "2026-02-10", category: "Facility Repairs", description: "Repair of leaking roof — Block C", amount: 132000 },
    { id: "EXP7", date: "2026-02-14", category: "Staff Welfare", description: "Mid-term staff refreshments", amount: 48000 },
    { id: "EXP8", date: "2026-02-18", category: "Instructional Materials", description: "Laboratory chemicals — Chemistry/Biology", amount: 97000 },
    { id: "EXP9", date: "2026-02-24", category: "Utilities", description: "Generator diesel restock", amount: 88000 },
    { id: "EXP10", date: "2026-03-02", category: "Feeding Supplies", description: "Foodstuff restock for feeding unit", amount: 175000 },
    { id: "EXP11", date: "2026-03-06", category: "Fuel & Vehicle Maintenance", description: "Fuel for all buses — full month", amount: 152000 },
    { id: "EXP12", date: "2026-03-11", category: "Miscellaneous / Office Supplies", description: "Printing of Second Term result sheets and stationery", amount: 62000 },
    { id: "EXP13", date: "2026-03-17", category: "Facility Repairs", description: "Plumbing repairs — staff quarters", amount: 54000 },
    { id: "EXP14", date: "2026-03-23", category: "Instructional Materials", description: "Sports equipment for Inter-House competitions", amount: 118000 },
    { id: "EXP15", date: "2026-03-28", category: "Staff Welfare", description: "Transport allowance top-up for teaching staff", amount: 70000 },
    { id: "EXP16", date: "2026-04-02", category: "Utilities", description: "Electricity bill and generator diesel", amount: 91000 },
    { id: "EXP17", date: "2026-04-07", category: "Miscellaneous / Office Supplies", description: "Office stationery and printer supplies", amount: 39000 }
  ];

  // Revenue by month — invented, broadly consistent with overall fee collection, for the Revenue vs Expenses chart
  const REVENUE_BY_MONTH = [
    { month: "Jan 2026", amount: 3850000 },
    { month: "Feb 2026", amount: 2960000 },
    { month: "Mar 2026", amount: 3320000 },
    { month: "Apr 2026", amount: 1180000 }
  ];

  // Tax / statutory remittance log (PAYE)
  const TAX_RECORDS = [
    { id: "TAX1", period: "January 2026", type: "PAYE Remittance", amount: Math.round(TOTAL_MONTHLY_PAYROLL * 0.075), datePaid: "2026-02-05", status: "Remitted" },
    { id: "TAX2", period: "February 2026", type: "PAYE Remittance", amount: Math.round(TOTAL_MONTHLY_PAYROLL * 0.075), datePaid: "2026-03-05", status: "Remitted" },
    { id: "TAX3", period: "March 2026", type: "PAYE Remittance", amount: Math.round(TOTAL_MONTHLY_PAYROLL * 0.075), datePaid: "2026-04-05", status: "Remitted" },
    { id: "TAX4", period: "April 2026", type: "PAYE Remittance", amount: Math.round(TOTAL_MONTHLY_PAYROLL * 0.075), datePaid: null, status: "Pending" }
  ];

  USERS.push({ username: "accounts.officer", password: "finance123", role: "finance", label: "Account / Finance Department", refId: null });

  // ---------- Export ----------
  window.SCHOOL = {
    meta: SCHOOL_META,
    terms: TERMS,
    currentTermId: CURRENT_TERM_ID,
    houses: HOUSES,
    clubs: CLUBS,
    classes: CLASSES,
    sections: SECTIONS,
    sectionForClass,
    subjectsFor,
    gradeScale: GRADE_SCALE,
    gradeFor,
    students: STUDENTS,
    teachers: TEACHERS,
    leadershipStaff: LEADERSHIP_STAFF,
    nonTeachingStaff: NON_TEACHING_STAFF,
    applications: APPLICATIONS,
    drivers: DRIVERS,
    routes: ROUTES,
    calendarEvents: CALENDAR_EVENTS,
    announcements: ANNOUNCEMENTS,
    users: USERS,
    payrollStaff: PAYROLL_STAFF,
    totalMonthlyPayroll: TOTAL_MONTHLY_PAYROLL,
    expenses: EXPENSES,
    revenueByMonth: REVENUE_BY_MONTH,
    taxRecords: TAX_RECORDS
  };
})();
