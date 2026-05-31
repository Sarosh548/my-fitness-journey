// ── FITNESS JOURNEY APP ──

const START_WEIGHT = 57.0;
const GOAL_WEIGHT = 70.0;
const GOAL_DATE = new Date('2027-01-01');
const START_DATE = new Date('2026-06-01');

// ── STATE ──
let state = {
  weights: {},       // { 'YYYY-MM-DD': kg }
  checks: {},        // { 'YYYY-MM-DD': [taskId, ...] }
  water: {},         // { 'YYYY-MM-DD': count }
  currentWorkoutPhase: 1,
  currentNutriPhase: 1,
};

function loadState() {
  try {
    const saved = localStorage.getItem('fj_state');
    if (saved) state = { ...state, ...JSON.parse(saved) };
  } catch(e) {}
}

function saveState() {
  localStorage.setItem('fj_state', JSON.stringify(state));
}

// ── UTILS ──
function todayStr() {
  return new Date().toISOString().split('T')[0];
}

function formatDate(d) {
  return d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

function dayOfWeek() {
  return new Date().getDay(); // 0=Sun, 1=Mon ...
}

function getDayIndex() {
  const d = new Date().getDay();
  return d === 0 ? 6 : d - 1; // Mon=0 ... Sun=6
}

function currentWeight() {
  const keys = Object.keys(state.weights).sort();
  if (keys.length === 0) return START_WEIGHT;
  return state.weights[keys[keys.length - 1]];
}

function daysUntilGoal() {
  const now = new Date();
  const diff = Math.ceil((GOAL_DATE - now) / (1000 * 60 * 60 * 24));
  return Math.max(0, diff);
}

function getCurrentPhase() {
  const now = new Date();
  const month1End = new Date('2026-07-01');
  return now < month1End ? 1 : 2;
}

// ── NAVIGATION ──
function navigate(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  const page = document.getElementById('page-' + pageId);
  if (page) page.classList.add('active');
  const link = document.querySelector('[data-page="' + pageId + '"]');
  if (link) link.classList.add('active');
  if (pageId === 'dashboard') renderDashboard();
  if (pageId === 'today') renderToday();
  if (pageId === 'workout') renderWorkout();
  if (pageId === 'nutrition') renderNutrition(state.currentNutriPhase);
  if (pageId === 'progress') renderProgress();
  if (pageId === 'schedule') renderSchedule();
  // close mobile sidebar
  document.getElementById('sidebar').classList.remove('open');
}

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    navigate(link.dataset.page);
  });
});

document.getElementById('hamburger').addEventListener('click', () => {
  document.getElementById('sidebar').classList.toggle('open');
});

// ── DASHBOARD ──
function renderDashboard() {
  const cw = currentWeight();
  const togo = Math.max(0, GOAL_WEIGHT - cw).toFixed(1);
  const gained = Math.max(0, cw - START_WEIGHT).toFixed(1);
  const pct = Math.min(100, Math.round((cw - START_WEIGHT) / (GOAL_WEIGHT - START_WEIGHT) * 100));
  const today = todayStr();
  const waterToday = state.water[today] || 0;
  const phase = getCurrentPhase();
  const calTarget = phase === 1 ? 2800 : 3200;
  const checks = state.checks[today] || [];

  document.getElementById('stat-weight').innerHTML = cw.toFixed(1) + ' <span>kg</span>';
  document.getElementById('stat-togo').innerHTML = togo + ' <span>kg</span>';
  document.getElementById('stat-water').innerHTML = waterToday + ' <span>/12</span>';
  document.getElementById('stat-days-left').textContent = daysUntilGoal() + ' days left';
  document.getElementById('stat-cal-target').textContent = 'Target: ' + calTarget;
  document.getElementById('weight-bar').style.width = pct + '%';
  document.getElementById('overall-pct').textContent = pct + '%';
  document.getElementById('dash-date').textContent = formatDate(new Date());
  document.getElementById('dash-phase-badge').textContent = phase === 1 ? 'Phase 1 · Home Workouts' : 'Phase 2 · Gym Training';
  document.getElementById('sidebar-phase').querySelector('#phase-text').textContent = phase === 1 ? 'Month 1 · Home' : 'Months 2–7 · Gym';

  // Count cal eaten today
  const mealData = phase === 1 ? DATA.meals.phase1 : DATA.meals.phase2;
  let calsEaten = 0;
  mealData.forEach((m, i) => {
    if (checks.includes('meal-' + i)) calsEaten += m.cal;
  });
  document.getElementById('stat-cals').innerHTML = calsEaten + ' <span>kcal</span>';

  // Mini stats
  const totalWeeks = Math.floor((new Date() - START_DATE) / (1000 * 60 * 60 * 24 * 7));
  document.getElementById('ms-weeks').textContent = Math.max(0, totalWeeks);
  document.getElementById('ms-streak').textContent = calcStreak();
  document.getElementById('ms-workouts').textContent = countWorkouts();

  // Quick checklist
  const dayIdx = getDayIndex();
  const workouts = phase === 1 ? DATA.homeWorkouts : DATA.gymWorkouts;
  const todayWorkout = workouts[dayIdx];
  const quickItems = [
    { id: 'run', label: '6:00 AM · Morning run (1 hour)' },
    { id: 'breakfast', label: '7:15 AM · Post-run breakfast' },
    { id: 'workout-done', label: '5:00 PM · ' + todayWorkout.label },
    { id: 'water-12', label: 'Drink 12 glasses of water' },
    { id: 'dinner', label: '7:30 PM · Dinner' },
    { id: 'sleep', label: '10:30 PM · Sleep 8 hours' },
  ];

  const ql = document.getElementById('quick-checklist');
  ql.innerHTML = quickItems.map(item => {
    const done = checks.includes('q-' + item.id);
    return `<li class="${done ? 'done' : ''}" onclick="toggleQuick('${item.id}')">
      <div class="chk ${done ? 'on' : ''}"></div>
      ${item.label}
    </li>`;
  }).join('');

  renderWeightChart();
}

function toggleQuick(id) {
  const today = todayStr();
  if (!state.checks[today]) state.checks[today] = [];
  const arr = state.checks[today];
  const key = 'q-' + id;
  const idx = arr.indexOf(key);
  if (idx === -1) arr.push(key); else arr.splice(idx, 1);
  saveState();
  renderDashboard();
}

function calcStreak() {
  let streak = 0;
  const d = new Date();
  for (let i = 0; i < 365; i++) {
    const ds = d.toISOString().split('T')[0];
    const checks = state.checks[ds] || [];
    if (checks.length >= 3) { streak++; d.setDate(d.getDate() - 1); }
    else break;
  }
  return streak;
}

function countWorkouts() {
  return Object.values(state.checks).filter(arr => arr.includes('q-workout-done')).length;
}

function renderWeightChart() {
  const canvas = document.getElementById('weight-chart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const entries = Object.entries(state.weights).sort((a, b) => a[0].localeCompare(b[0]));

  canvas.width = canvas.offsetWidth;
  canvas.height = 160;
  const W = canvas.width, H = canvas.height;
  const pad = { top: 20, right: 20, bottom: 30, left: 40 };

  ctx.clearRect(0, 0, W, H);

  if (entries.length < 2) {
    ctx.fillStyle = '#9ca3af';
    ctx.font = '13px DM Sans';
    ctx.textAlign = 'center';
    ctx.fillText('Log your weight each day to see your progress chart here', W / 2, H / 2);
    return;
  }

  const vals = entries.map(e => e[1]);
  const minV = Math.min(...vals, START_WEIGHT) - 1;
  const maxV = Math.max(...vals, GOAL_WEIGHT) + 1;

  function xPos(i) { return pad.left + (i / (entries.length - 1)) * (W - pad.left - pad.right); }
  function yPos(v) { return pad.top + (1 - (v - minV) / (maxV - minV)) * (H - pad.top - pad.bottom); }

  // Goal line
  ctx.strokeStyle = '#dcfce7';
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(pad.left, yPos(GOAL_WEIGHT));
  ctx.lineTo(W - pad.right, yPos(GOAL_WEIGHT));
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = '#16a34a';
  ctx.font = '11px DM Mono';
  ctx.textAlign = 'left';
  ctx.fillText('Goal 70kg', pad.left + 4, yPos(GOAL_WEIGHT) - 4);

  // Line
  ctx.strokeStyle = '#111827';
  ctx.lineWidth = 2;
  ctx.beginPath();
  entries.forEach(([, v], i) => {
    i === 0 ? ctx.moveTo(xPos(i), yPos(v)) : ctx.lineTo(xPos(i), yPos(v));
  });
  ctx.stroke();

  // Dots
  entries.forEach(([, v], i) => {
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#111827';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(xPos(i), yPos(v), 4, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();
  });

  // X labels
  ctx.fillStyle = '#9ca3af';
  ctx.font = '10px DM Mono';
  ctx.textAlign = 'center';
  entries.forEach(([date], i) => {
    if (i % Math.max(1, Math.floor(entries.length / 5)) === 0) {
      const short = date.slice(5);
      ctx.fillText(short, xPos(i), H - 8);
    }
  });

  // Y labels
  ctx.textAlign = 'right';
  [minV + 1, START_WEIGHT, GOAL_WEIGHT].forEach(v => {
    ctx.fillStyle = '#9ca3af';
    ctx.fillText(v.toFixed(0) + 'kg', pad.left - 4, yPos(v) + 4);
  });
}

// ── TODAY ──
function renderToday() {
  const today = todayStr();
  const checks = state.checks[today] || [];
  const waterToday = state.water[today] || 0;
  const phase = getCurrentPhase();
  const dayIdx = getDayIndex();
  const workouts = phase === 1 ? DATA.homeWorkouts : DATA.gymWorkouts;
  const mealData = phase === 1 ? DATA.meals.phase1 : DATA.meals.phase2;
  const todayWorkout = workouts[dayIdx];

  document.getElementById('today-weekday').textContent = formatDate(new Date());

  // Build timeline items
  const timelineItems = [
    { time: '6:00', id: 'run', title: 'Morning Run', detail: '1 hour easy pace · build to 7km over 4 weeks', type: 'run' },
    { time: '7:15', id: 'breakfast', title: 'Post-run Breakfast', detail: mealData[0]?.items || '', type: 'eat' },
    { time: '9:00–3:00', id: 'work', title: 'Work / Study', detail: 'Stay focused, eat lunch at 1pm', type: 'work' },
    { time: '4:00', id: 'snack', title: 'Afternoon Snack', detail: mealData[3]?.items || mealData[2]?.items || '', type: 'eat' },
    { time: '5:00', id: 'workout', title: todayWorkout.label + ' Workout', detail: todayWorkout.exercises.map(e => e.name).join(' · '), type: 'workout' },
    { time: '7:30', id: 'dinner', title: 'Dinner', detail: (phase === 1 ? mealData[4] : mealData[5])?.items || '', type: 'eat' },
    { time: '9:30', id: 'nightsnack', title: 'Night Recovery Snack', detail: (phase === 1 ? mealData[5] : mealData[6])?.items || '', type: 'eat' },
    { time: '10:30', id: 'sleep', title: 'Sleep', detail: 'Minimum 8 hours — muscle builds during sleep', type: 'sleep' },
  ];

  const totalItems = timelineItems.length;
  const doneCount = timelineItems.filter(t => checks.includes('tl-' + t.id)).length;
  const pct = totalItems ? Math.round(doneCount / totalItems * 100) : 0;

  document.getElementById('today-pct').textContent = pct + '%';
  const circle = document.getElementById('ring-circle');
  if (circle) {
    circle.setAttribute('stroke-dasharray', pct + ' ' + (100 - pct));
  }

  const tlEl = document.getElementById('timeline');
  tlEl.innerHTML = timelineItems.map(item => {
    const done = checks.includes('tl-' + item.id);
    return `<div class="tl-item">
      <div class="tl-left">${item.time}</div>
      <div class="tl-line"><div class="tl-dot ${done ? 'done' : ''}"></div></div>
      <div class="tl-content">
        <div class="tl-title">${item.title}</div>
        <div class="tl-detail">${item.detail}</div>
        <button class="tl-check-btn ${done ? 'done' : ''}" onclick="toggleTimeline('${item.id}')">
          ${done ? '✓ Done' : 'Mark done'}
        </button>
      </div>
    </div>`;
  }).join('');

  // Water glasses
  const gg = document.getElementById('glasses-grid');
  gg.innerHTML = Array.from({ length: 12 }, (_, i) =>
    `<div class="glass ${i < waterToday ? 'filled' : ''}" onclick="tapGlass(${i})">
      <div class="glass-fill"></div>
    </div>`
  ).join('');
  document.getElementById('water-tag').textContent = waterToday + ' / 12 glasses';

  const saved = state.weights[today];
  if (saved) document.getElementById('wt-saved').textContent = '✓ ' + saved + ' kg saved';
}

function toggleTimeline(id) {
  const today = todayStr();
  if (!state.checks[today]) state.checks[today] = [];
  const key = 'tl-' + id;
  const idx = state.checks[today].indexOf(key);
  if (idx === -1) state.checks[today].push(key);
  else state.checks[today].splice(idx, 1);
  saveState();
  renderToday();
}

function tapGlass(i) {
  const today = todayStr();
  state.water[today] = i + 1;
  saveState();
  renderToday();
}

function logWeight() {
  const val = parseFloat(document.getElementById('wt-input').value);
  if (isNaN(val) || val < 40 || val > 150) {
    alert('Please enter a valid weight between 40 and 150 kg');
    return;
  }
  const today = todayStr();
  state.weights[today] = val;
  saveState();
  document.getElementById('wt-saved').textContent = '✓ ' + val + ' kg saved today';
  document.getElementById('wt-input').value = '';
}

// ── WORKOUT ──
let workoutPhaseView = 1;

function setWorkoutPhase(p) {
  workoutPhaseView = p;
  document.getElementById('ptab1').classList.toggle('active', p === 1);
  document.getElementById('ptab2').classList.toggle('active', p === 2);
  renderWorkout();
}

function renderWorkout() {
  const workouts = workoutPhaseView === 1 ? DATA.homeWorkouts : DATA.gymWorkouts;
  const grid = document.getElementById('workout-grid');
  grid.innerHTML = workouts.map(day => `
    <div class="workout-card">
      <div class="workout-card-head">
        <div>
          <h3>${day.label}</h3>
          <div class="day-label">${day.day} · ${day.tag}</div>
        </div>
      </div>
      <ul class="exercise-list">
        ${day.exercises.map(e => `
          <li>
            <span>${e.name}</span>
            <span class="ex-sets">${e.sets} — ${e.tip}</span>
          </li>
        `).join('')}
      </ul>
    </div>
  `).join('');
}

// ── NUTRITION ──
function setNutriPhase(p, btn) {
  state.currentNutriPhase = p;
  document.querySelectorAll('.ntab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  renderNutrition(p);
}

function renderNutrition(p) {
  const meals = p === 1 ? DATA.meals.phase1 : DATA.meals.phase2;
  const total = meals.reduce((a, m) => a + m.cal, 0);
  const grid = document.getElementById('meal-plan-grid');
  grid.innerHTML = meals.map(m => `
    <div class="meal-card">
      <div class="meal-time">${m.time}</div>
      <div>
        <div class="meal-name">${m.name}</div>
        <div class="meal-items">${m.items}</div>
      </div>
      <div class="meal-cal">${m.cal} kcal</div>
    </div>
  `).join('') + `
    <div style="text-align:right;font-size:13px;color:#374151;padding:8px 0;font-weight:600">
      Total: ${total} kcal / day
    </div>`;
}

// ── PROGRESS ──
function renderProgress() {
  const cw = currentWeight();
  const gained = (cw - START_WEIGHT).toFixed(1);
  document.getElementById('prog-cur').innerHTML = cw.toFixed(1) + ' <span>kg</span>';
  document.getElementById('prog-gained').innerHTML = gained + ' <span>kg</span>';

  // Month targets
  const mt = document.getElementById('month-targets');
  mt.innerHTML = DATA.monthTargets.map(m => {
    const pct = Math.min(100, Math.round((cw - START_WEIGHT) / (m.target - START_WEIGHT) * 100));
    const reached = cw >= m.target;
    return `<div class="month-target-card">
      <div class="mt-month">${m.month}</div>
      <div class="mt-weight" style="color:${reached ? '#16a34a' : '#111827'}">${m.target} kg</div>
      <div class="mt-gained">${m.phase}</div>
      <div class="mt-bar-bg"><div class="mt-bar-fill" style="width:${reached ? 100 : Math.max(0, pct)}%"></div></div>
    </div>`;
  }).join('');

  renderProgressChart();
}

function renderProgressChart() {
  const canvas = document.getElementById('progress-chart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = canvas.offsetWidth;
  canvas.height = 200;
  const W = canvas.width, H = canvas.height;
  const pad = { top: 20, right: 20, bottom: 35, left: 45 };

  ctx.clearRect(0, 0, W, H);

  // projected line from start to goal
  const totalDays = Math.ceil((GOAL_DATE - START_DATE) / (1000 * 60 * 60 * 24));
  const projPoints = [[0, START_WEIGHT], [totalDays, GOAL_WEIGHT]];

  // actual entries
  const entries = Object.entries(state.weights)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([d, v]) => {
      const days = Math.ceil((new Date(d) - START_DATE) / (1000 * 60 * 60 * 24));
      return [days, v];
    });

  function xPos(d) { return pad.left + (d / totalDays) * (W - pad.left - pad.right); }
  function yPos(v) { return pad.top + (1 - (v - 55) / (GOAL_WEIGHT + 2 - 55)) * (H - pad.top - pad.bottom); }

  // Grid
  ctx.strokeStyle = '#f3f4f6';
  ctx.lineWidth = 1;
  [57, 60, 63, 66, 69, 70].forEach(v => {
    ctx.beginPath(); ctx.moveTo(pad.left, yPos(v)); ctx.lineTo(W - pad.right, yPos(v)); ctx.stroke();
    ctx.fillStyle = '#9ca3af'; ctx.font = '10px DM Mono'; ctx.textAlign = 'right';
    ctx.fillText(v + 'kg', pad.left - 4, yPos(v) + 4);
  });

  // Projected line
  ctx.strokeStyle = '#e5e7eb';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(xPos(projPoints[0][0]), yPos(projPoints[0][1]));
  ctx.lineTo(xPos(projPoints[1][0]), yPos(projPoints[1][1]));
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = '#9ca3af'; ctx.font = '11px DM Sans'; ctx.textAlign = 'left';
  ctx.fillText('Projected', xPos(totalDays / 2), yPos(63.5) - 6);

  // Actual line
  if (entries.length >= 1) {
    ctx.strokeStyle = '#111827'; ctx.lineWidth = 2;
    ctx.beginPath();
    entries.forEach(([d, v], i) => {
      i === 0 ? ctx.moveTo(xPos(d), yPos(v)) : ctx.lineTo(xPos(d), yPos(v));
    });
    ctx.stroke();
    entries.forEach(([d, v]) => {
      ctx.fillStyle = '#fff'; ctx.strokeStyle = '#111827'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(xPos(d), yPos(v), 4, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    });
  }

  // X axis months
  const months = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'];
  months.forEach((m, i) => {
    ctx.fillStyle = '#9ca3af'; ctx.font = '10px DM Mono'; ctx.textAlign = 'center';
    ctx.fillText(m, xPos(i * 30), H - 10);
  });
}

// ── SCHEDULE ──
function renderSchedule() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const todayIdx = getDayIndex();
  const phase = getCurrentPhase();
  const workouts = phase === 1 ? DATA.homeWorkouts : DATA.gymWorkouts;

  const grid = document.getElementById('schedule-grid');
  grid.innerHTML = days.map((d, i) => {
    const w = workouts[i];
    const isToday = i === todayIdx;
    return `<div class="sched-col ${isToday ? 'today' : ''}">
      <div class="sched-day">${d}</div>
      <div class="sched-item run">Run 1hr</div>
      <div class="sched-item workout">${w.label}</div>
      ${i === 5 || i === 6 ? '<div class="sched-item rest">Rest</div>' : ''}
    </div>`;
  }).join('');

  const tb = document.getElementById('time-blocks');
  tb.innerHTML = DATA.schedule.timeBlocks.map(b => `
    <div class="tb-row">
      <div class="tb-time">${b.time}</div>
      <div class="tb-block ${b.type}">
        <div class="tb-title">${b.label}</div>
        <div class="tb-sub">${b.sub}</div>
      </div>
    </div>
  `).join('');
}

// ── INIT ──
loadState();
const dateStr = formatDate(new Date());
if (document.getElementById('dash-date')) document.getElementById('dash-date').textContent = dateStr;
if (document.getElementById('mobile-date')) document.getElementById('mobile-date').textContent = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

navigate('dashboard');
window.addEventListener('resize', () => {
  renderWeightChart();
  renderProgressChart();
});
