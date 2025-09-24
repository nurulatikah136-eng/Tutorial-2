/* ====== Storage helpers (localStorage, safe JSON) ====== */
function getStore(key, fallback) {
    try {
        const s = localStorage.getItem(key);
        return s ? JSON.parse(s) : fallback;
    } catch (e) {
        return fallback;
    }
}

function setStore(key, val) {
    try {
        localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {}
}

function updateStore(key, callback) {
    const data = getStore(key, []);
    const newData = callback(data);
    setStore(key, newData);
}

/* ====== Pages controller ====== */
const pages = ['page-start', 'page-quiz', 'page-student', 'page-leader', 'page-cert', 'page-admin'];

function showPage(id) {
    pages.forEach(pid => {
        const el = document.getElementById(pid);
        if (!el) return;
        el.classList.toggle('active', pid === id);
    });
}

/* ====== Question bank (user-provided) ====== */
const QUESTION_BANK = [
    { id: 'Q1', type: 'subjective', prompt: 'State the terminology for the following descriptions:', parts: [{ key: 'a', text: 'The values resulting in an equation or inequality to be true.', answer: ['solution', 'solutions'] }, { key: 'b', text: 'The term ax² in the quadratic expression ax² + bx + c.', answer: ['quadratic term'] }, { key: 'c', text: 'The multiplicative factor of x in linear or quadratic expression.', answer: ['linear coefficient', 'coefficient of x', 'coefficient'] }, { key: 'd', text: 'The values resulting in an expression to evaluate to zero.', answer: ['zeroes', 'zeros', 'roots'] }, { key: 'e', text: 'The other terminology for absolute value of x.', answer: ['modulus'] }, ], solutionSteps: 'a) Solution\nb) Quadratic term\nc) Linear coefficient\nd) Zeroes (of the expression)\ne) Modulus' },
    { id: 'Q2', type: 'mcq', prompt: 'Solve: √(2x + 3) + √(x − 2) = 4', options: [{ k: 'a', t: 'x = 83' }, { k: 'b', t: 'x = 4' }, { k: 'c', t: 'x = 3' }, { k: 'd', t: 'x = 2' }], correct: 'c', solutionSteps: 'Isolate and square carefully. Check extraneous roots: valid solution is x=3.' },
    { id: 'Q3', type: 'mcq', prompt: 'Evaluate (x² + 3x + 2)/(x + 1) ≥ 0', options: [{ k: 'a', t: '(-∞, -1) ∪ (-1, ∞)' }, { k: 'b', t: '[-2, -1) ∪ (-1, ∞)' }, { k: 'c', t: '(-∞, -2] ∪ (-1, ∞)' }, { k: 'd', t: '[-2, ∞)' }], correct: 'b', solutionSteps: 'Critical points at x=-2 and x=-1 (excluded). Sign chart → [-2,-1) ∪ (-1,∞).' },
    { id: 'Q4', type: 'mcq', prompt: 'Find range: (3x + 2)(2x + 5) < 0', options: [{ k: 'a', t: '(-∞, -5/2)' }, { k: 'b', t: '(-5/2, -2/3)' }, { k: 'c', t: '(-2/3, ∞)' }, { k: 'd', t: '(-∞, -2/3)' }], correct: 'b', solutionSteps: 'Roots at -5/2 and -2/3. Negative between roots → (-5/2, -2/3).' },
    { id: 'Q5', type: 'mcq', prompt: 'Solve: ((x + 2)(x - 1))/(x + 1) < 0', options: [{ k: 'a', t: '(-∞, -2) ∪ (-1, 1)' }, { k: 'b', t: '(-∞, -1) ∪ (1, ∞)' }, { k: 'c', t: '(-2, -1) ∪ (1, ∞)' }, { k: 'd', t: '(-∞, 1)' }], correct: 'a', solutionSteps: 'Critical points -2,-1,1. Sign chart → (-∞,-2) ∪ (-1,1).' },
    { id: 'Q6a', type: 'mcq', prompt: 'Solve: (2x − 1)/(x − 1) > 1', options: [{ k: 'a', t: '(0, 1)' }, { k: 'b', t: '(-∞, 0) ∪ (1, ∞)' }, { k: 'c', t: '(0, ∞)' }, { k: 'd', t: '(1, ∞)' }], correct: 'b', solutionSteps: 'Bring to one side, consider domain x≠1. Solution → (-∞,0) ∪ (1,∞).' },
    { id: 'Q6b', type: 'mcq', prompt: 'Solve: (x² − 3x + 2)/(x − 3) ≥ 0', options: [{ k: 'a', t: '(-∞, 1] ∪ [2, 3)' }, { k: 'b', t: '[1, 2] ∪ (3, ∞)' }, { k: 'c', t: '(1, 2) ∪ (3, ∞)' }, { k: 'd', t: '[1, 3)' }], correct: 'b', solutionSteps: 'Factor numerator (x−1)(x−2). Consider x=3 excluded. Nonnegative on [1,2] ∪ (3,∞).' },
    { id: 'Q7', type: 'mcq', prompt: 'Solve: |5x + 7| > |4x − 6|', options: [{ k: 'a', t: '(-∞, -13) ∪ (-1, 9)' }, { k: 'b', t: '(-∞, -13) ∪ (-1/9, ∞)' }, { k: 'c', t: '(-13, -1/9)' }, { k: 'd', t: '(-1/9, 13)' }], correct: 'b', solutionSteps: 'Square both sides or compare distances; solution (-∞, -13) ∪ (-1/9, ∞).' },
    { id: 'Q8', type: 'mcq', prompt: 'Solve: |3x + 4| ≥ |x + 2|', options: [{ k: 'a', t: '(-∞, -1] ∪ [2, ∞)' }, { k: 'b', t: '(-∞, -3/2] ∪ [-1, ∞)' }, { k: 'c', t: '[-1, ∞)' }, { k: 'd': '(-∞, -3/2)' }], correct: 'b', solutionSteps: 'Square and simplify: 9x²+24x+16 ≥ x²+4x+4 → 8x²+20x+12 ≥ 0 → intervals yield result.' },
    { id: 'Q9', type: 'mcq', prompt: 'Solve: |(x + 3)/x| > 1', options: [{ k: 'a', t: '(-∞, -3/2) ∪ (0, ∞)' }, { k: 'b', t: '(-3/2, 0) ∪ (0, ∞)' }, { k: 'c', t: '(-∞, 0)' }, { k: 'd': '(0, ∞)' }], correct: 'b', solutionSteps: 'Casework on x>0 and x<0; exclude x=0. Result (-3/2,0) ∪ (0,∞).' },
    { id: 'Q10', type: 'mcq', prompt: 'Solve: 2x² − 3x − 4 = 0', options: [{ k: 'a', t: 'x = (3 ± √41)/2' }, { k: 'b', t: 'x = (-3 ± √41)/4' }, { k: 'c', t: 'x = (3 ± √41)/4' }, { k: 'd': 'x = (3 ± √41)/8' }], correct: 'c', solutionSteps: 'Quadratic formula: x = [3 ± √(9+32)]/(2·2) = (3 ± √41)/4.' }
];

/* ====== Runtime quiz state ====== */
let quiz = {
    student: null, // {name, matric, klass}
    list: [], // randomized questions
    idx: 0, // current index
    answers: [], // per-question or per-part answers
    startedAt: 0, // ms timestamp
    finishedAt: 0, // ms timestamp
    timerId: null // live timer interval
};

/* ====== Utility formatting ====== */
function mmss(sec) {
    const s = Math.max(0, Math.floor(sec));
    const m = Math.floor(s / 60);
    const r = s % 60;
    return (m < 10 ? '0' : '') + m + ':' + (r < 10 ? '0' : '') + r;
}

/* ====== Live monitoring logic ====== */
const ADMIN_SECRET = "Anis120467//";
const LIVE_KEY = 'quizLiveResults';

function publishUpdate() {
    const liveData = {
        id: quiz.student.matric,
        name: quiz.student.name,
        klass: quiz.student.klass,
        progress: quiz.idx + 1,
        total: quiz.list.length,
        time: Math.round((Date.now() - quiz.startedAt) / 1000),
        answers: quiz.answers,
        submitted: false
    };

    updateStore(LIVE_KEY, data => {
        const existingIndex = data.findIndex(rec => rec.id === liveData.id);
        if (existingIndex !== -1) {
            data[existingIndex] = liveData;
        } else {
            data.push(liveData);
        }
        return data;
    });
    localStorage.setItem('quizUpdateSignal', Date.now());
}

function scoreLiveAnswers(answers, list) {
    let score = 0;
    list.forEach(q => {
        const rec = answers.find(a => a.id === q.id);
        if (!rec) return;

        if (q.type === 'subjective') {
            const parts = rec.parts || {};
            const allCorrect = q.parts.every(p => {
                const ans = (parts[p.key] || '').toLowerCase().trim();
                return p.answer.some(acc => ans === acc.toLowerCase());
            });
            if (allCorrect) score += 1;
        } else {
            if (rec.choice === q.correct) score += 1;
        }
    });
    return score;
}

function buildAdminTable() {
    const liveResults = getStore(LIVE_KEY, []);
    const filterClass = document.getElementById('adminClass').value || '';
    const filteredResults = filterClass ? liveResults.filter(r => r.klass === filterClass) : liveResults;
    const sorted = filteredResults.sort((a, b) => {
        const scoreA = scoreLiveAnswers(a.answers, QUESTION_BANK);
        const scoreB = scoreLiveAnswers(b.answers, QUESTION_BANK);
        if (scoreB !== scoreA) return scoreB - scoreA;
        return a.time - b.time;
    });

    const tb = document.querySelector('#tblAdmin tbody');
    if (!tb) return;
    tb.innerHTML = '';

    sorted.forEach((r, i) => {
        const score = scoreLiveAnswers(r.answers, QUESTION_BANK);
        const tr = document.createElement('tr');
        const progressText = r.submitted ? `Complete (${r.progress})` : `${r.progress}/${r.total}`;
        tr.innerHTML = `
            <td>${i + 1}</td>
            <td>${r.name}</td>
            <td>${r.klass}</td>
            <td>${r.matric}</td>
            <td>${score}/${QUESTION_BANK.length}</td>
            <td>${mmss(r.time)}</td>
            <td>${progressText}</td>
        `;
        tb.appendChild(tr);
    });

    // Update live indicator
    const indicator = document.getElementById('update-indicator');
    if (indicator) {
        indicator.classList.remove('dot-red');
        indicator.classList.add('dot-green');
        setTimeout(() => {
            indicator.classList.remove('dot-green');
            indicator.classList.add('dot-red');
        }, 1000);
    }
}

// Listen for updates from other tabs/windows
window.addEventListener('storage', (event) => {
    if (event.key === 'quizUpdateSignal' && document.getElementById('page-admin').classList.contains('active')) {
        buildAdminTable();
    }
});

/* ====== Start flow ====== */
document.getElementById('btnStart').addEventListener('click', () => {
    const name = document.getElementById('stuName').value.trim();
    const matric = document.getElementById('stuMatric').value.trim();
    const klass = document.getElementById('stuClass').value.trim();
    if (!name || !matric || !klass) {
        alert('Please fill name, matric and class.');
        return;
    }
    quiz.student = { name, matric, klass };
    quiz.list = [...QUESTION_BANK].sort(() => Math.random() - 0.5);
    quiz.idx = 0;
    quiz.answers = [];
    quiz.startedAt = Date.now();
    quiz.finishedAt = 0;
    document.getElementById('hdrName').textContent = name;
    document.getElementById('hdrMatric').textContent = matric;
    document.getElementById('hdrClass').textContent = klass;
    document.getElementById('qTotal').textContent = quiz.list.length;
    showPage('page-quiz');
    renderQuestion();
    startLiveTimer();
    publishUpdate(); // Initial publish
});

/* ====== Live timer ====== */
function startLiveTimer() {
    const el = document.getElementById('timeLive');
    if (quiz.timerId) clearInterval(quiz.timerId);
    quiz.timerId = setInterval(() => {
        const sec = (Date.now() - quiz.startedAt) / 1000;
        el.textContent = mmss(sec);
        if (quiz.idx < quiz.list.length) {
            publishUpdate(); // Periodic update
        }
    }, 5000); // Update every 5 seconds
}

function stopLiveTimer() {
    if (quiz.timerId) {
        clearInterval(quiz.timerId);
        quiz.timerId = null;
    }
}

/* ====== Render current question ====== */
function renderQuestion() {
    const q = quiz.list[quiz.idx];
    const cont = document.getElementById('qContainer');
    document.getElementById('qNum').textContent = quiz.idx + 1;
    const pct = ((quiz.idx) / quiz.list.length) * 100;
    document.getElementById('progress').style.width = pct.toFixed(1) + '%';
    // ... (rest of renderQuestion function, same as before)
    if (q.type === 'subjective') {
        const prior = quiz.answers.find(a => a.id === q.id);
        const val = prior && prior.parts ? prior.parts : { a: '', b: '', c: '', d: '', e: '' };
        cont.innerHTML = `
            <div style="margin-bottom:8px">${q.prompt}</div>
            <div class="grid">
                ${q.parts.map(p => `
                    <div class="grid">
                        <label><b>(${p.key})</b> ${p.text}</label>
                        <input class="input" data-part="${p.key}" placeholder="Type your answer..." value="${(val[p.key] || '').replace(/"/g, '&quot;')}" />
                    </div>
                `).join('')}
            </div>
        `;
    } else {
        const prior = quiz.answers.find(a => a.id === q.id);
        const chosen = prior ? prior.choice : null;
        cont.innerHTML = `
            <div style="margin-bottom:8px">${q.prompt}</div>
            <div class="grid">
                ${q.options.map(o => `
                    <label class="opt">
                        <input type="radio" name="mcq" value="${o.k}" ${chosen === o.k ? 'checked' : ''} />
                        <div><b>(${o.k})</b> ${o.t}</div>
                    </label>
                `).join('')}
            </div>
        `;
    }

    document.getElementById('btnPrev').disabled = quiz.idx === 0;
    document.getElementById('btnNext').textContent = (quiz.idx === quiz.list.length - 1) ? 'Submit Quiz' : 'Next';
}

/* ====== Capture current answer (without advancing) ====== */
function captureAnswer() {
    const q = quiz.list[quiz.idx];
    let rec = quiz.answers.find(a => a.id === q.id);
    if (!rec) {
        rec = { id: q.id };
        quiz.answers.push(rec);
    }
    if (q.type === 'subjective') {
        const inputs = [...document.querySelectorAll('#qContainer input[data-part]')];
        const parts = {};
        inputs.forEach(inp => {
            parts[inp.dataset.part] = inp.value.trim()
        });
        rec.parts = parts;
    } else {
        const pick = document.querySelector('input[name="mcq"]:checked');
        rec.choice = pick ? pick.value : null;
    }
}

/* ====== Nav buttons ====== */
document.getElementById('btnPrev').addEventListener('click', () => {
    captureAnswer();
    if (quiz.idx > 0) {
        quiz.idx--;
        renderQuestion();
        publishUpdate();
    }
});

document.getElementById('btnNext').addEventListener('click', () => {
    captureAnswer();
    if (quiz.idx === quiz.list.length - 1) {
        endQuiz(); // Submit on last question
    } else {
        quiz.idx++;
        renderQuestion();
        publishUpdate();
    }
});

/* ====== Scoring ====== */
function scoreNow() {
    let score = 0,
        total = quiz.list.length;
    const detail = quiz.list.map(q => {
        if (q.type === 'subjective') {
            const rec = quiz.answers.find(a => a.id === q.id);
            const parts = (rec && rec.parts) ? rec.parts : {};
            const checks = q.parts.map(p => {
                const ans = (parts[p.key] || '').toLowerCase().trim();
                const ok = p.answer.some(acc => ans === acc.toLowerCase());
                return { key: p.key, given: parts[p.key] || '', correct: ok, expect: p.answer[0] };
            });
            const partScore = checks.every(c => c.correct) ? 1 : 0;
            score += partScore;
            return { id: q.id, type: q.type, correct: partScore === 1, parts: checks, solution: q.solutionSteps };
        } else {
            const rec = quiz.answers.find(a => a.id === q.id);
            const chosen = rec ? rec.choice : null;
            const ok = chosen === q.correct;
            if (ok) score += 1;
            const chosenText = q.options.find(o => o.k === chosen)?.t || '';
            const correctText = q.options.find(o => o.k === q.correct)?.t || '';
            return { id: q.id, type: q.type, correct: ok, chosen, chosenText, correctKey: q.correct, correctText, solution: q.solutionSteps };
        }
    });

    const finishedAt = quiz.finishedAt || Date.now();
    const timeSec = Math.max(1, Math.round((finishedAt - quiz.startedAt) / 1000));
    const pct = Math.round((score / total) * 100);

    return { score, total, pct, timeSec, detail };
}

/* ====== Persist and ranking ====== */
function saveAttempt(result) {
    const all = getStore('quizResults', []);
    const rec = {
        name: quiz.student.name,
        klass: quiz.student.klass,
        matric: quiz.student.matric,
        score: result.score,
        total: result.total,
        pct: result.pct,
        time: result.timeSec,
        detail: result.detail,
        ts: new Date().toISOString()
    };
    all.push(rec);
    setStore('quizResults', all);
    setStore('lastAttempt', rec);
    return rec;
}

function rankAll(filterClass) {
    const all = getStore('quizResults', []);
    const list = filterClass ? all.filter(r => r.klass === filterClass) : all.slice();
    list.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return a.time - b.time;
    });
    return list;
}

/* ====== End quiz ====== */
function endQuiz() {
    quiz.finishedAt = Date.now();
    stopLiveTimer();
    const result = scoreNow();
    const saved = saveAttempt(result);

    // Final update for live dashboard
    updateStore(LIVE_KEY, data => {
        const existingIndex = data.findIndex(rec => rec.id === quiz.student.matric);
        if (existingIndex !== -1) {
            data[existingIndex].submitted = true;
            data[existingIndex].time = result.timeSec;
            data[existingIndex].answers = quiz.answers;
            data[existingIndex].score = result.score;
        }
        return data;
    });
    localStorage.setItem('quizUpdateSignal', Date.now());

    buildStudentDashboard(saved);
    buildLeaderboard();
    showPage('page-student');
}

/* ====== Student dashboard build ====== */
function buildStudentDashboard(my) {
    // ... (rest of the function, same as before)
    const all = rankAll();
    const idx = all.findIndex(r => r.name === my.name && r.matric === my.matric && r.ts === my.ts);
    const rank = idx >= 0 ? (idx + 1) : '-';
    document.getElementById('kpiScore').textContent = `${my.score}/${my.total}`;
    document.getElementById('kpiPct').textContent = `${my.pct}%`;
    document.getElementById('kpiTime').textContent = `${my.time}s`;
    document.getElementById('kpiRank').textContent = `${rank}`;

    const tipsEl = document.getElementById('tips');
    let tip = 'Great effort. Review the step-by-step solutions below.';
    if (my.pct >= 90) tip = 'Outstanding! Keep challenging yourself with harder problems.';
    else if (my.pct >= 70) tip = 'Good job! Strengthen topics you missed to push above 90%.';
    else if (my.pct >= 50) tip = 'You’re close. Revisit fundamentals and practice similar items.';
    else tip = 'Start with basics: factoring, absolute value, and sign charts.';
    if (tipsEl) tipsEl.textContent = tip;

    const review = document.getElementById('review');
    if (!review) return;
    review.innerHTML = '';
    my.detail.forEach((d, i) => {
        const box = document.createElement('div');
        box.className = 'qcard';
        if (d.type === 'subjective') {
            const rows = d.parts.map(p => `
                <tr><td>(${p.key})</td><td class="mono">${p.given || '—'}</td><td>${p.correct ? '✅' : '❌'}</td><td class="mono">${p.expect}</td></tr>
            `).join('');
            box.innerHTML = `
                <div><b>Q${i + 1} • Subjective</b> ${d.correct ? '✅' : '❌'}</div>
                <table class="table"><thead><tr><th>Part</th><th>Your Answer</th><th></th><th>Expected</th></tr></thead><tbody>${rows}</tbody></table>
                <div class="muted" style="margin-top:8px;white-space:pre-line">${d.solution.replace(/\n/g, '\n')}</div>
            `;
        } else {
            const correctText = d.correctText || '';
            const chosenText = d.chosenText || '';
            box.innerHTML = `
                <div><b>Q${i + 1}</b> ${d.correct ? '✅' : '❌'}</div>
                <div class="grid two">
                    <div>Your Answer: <span class="${d.correct ? '' : 'muted'}">(${d.chosen || '—'}) ${chosenText}</span></div>
                    <div>Correct: <span class="gold">(${d.correctKey}) ${correctText}</span></div>
                </div>
                <div class="muted" style="margin-top:8px">${d.solution}</div>
            `;
        }
        review.appendChild(box);
    });
}

/* ====== Leaderboard build & Certificate build & Teacher admin (existing code, just updated) ====== */
function fillPodium(list) {
    const slots = [{ n: 'p1n', s: 'p1s' }, { n: 'p2n', s: 'p2s' }, { n: 'p3n', s: 'p3s' }];
    for (let i = 0; i < 3; i++) {
        const r = list[i];
        const nn = document.getElementById(slots[i].n);
        const ss = document.getElementById(slots[i].s);
        if (nn && ss) {
            if (r) {
                nn.textContent = r.name;
                ss.textContent = `${r.score}/${r.total} • ${r.time}s`;
            } else {
                nn.textContent = '–';
                ss.textContent = '–';
            }
        }
    }
}

function buildLeaderboard() {
    const sel = document.getElementById('filterClass');
    const list = rankAll(sel.value || '');
    fillPodium(list);
    const tb = document.querySelector('#tblLead tbody');
    if (!tb) return;
    tb.innerHTML = '';
    list.forEach((r, i) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${i + 1}</td>
            <td>${r.name}</td>
            <td>${r.klass}</td>
            <td>${r.matric}</td>
            <td>${r.score}/${r.total}</td>
            <td>${r.pct}%</td>
            <td>${r.time}</td>
            <td>${new Date(r.ts).toLocaleString()}</td>
        `;
        tb.appendChild(tr);
    });
}

function buildCert() {
    const last = getStore('lastAttempt', null);
    if (!last) {
        alert('No attempt found. Complete a quiz first.');
        return;
    }
    document.getElementById('cName').textContent = last.name;
    document.getElementById('cScore').textContent = `${last.score}/${last.total} (${last.pct}%)`;
    document.getElementById('cTime').textContent = `${last.time}s`;
    document.getElementById('cDate').textContent = new Date(last.ts).toLocaleDateString();
}

document.getElementById('btnAdminLogin').addEventListener('click', () => {
    const v = document.getElementById('adminPass').value;
    if (v === ADMIN_SECRET) {
        document.getElementById('gate').style.display = 'none';
        document.getElementById('adminBody').style.display = 'block';
        showPage('page-admin');
        buildAdminTable(); // Initial build
        setInterval(buildAdminTable, 5000); // Live update every 5 seconds
    } else {
        alert('Wrong password');
    }
});

document.getElementById('adminClass').addEventListener('change', buildAdminTable);
document.getElementById('btnClear').addEventListener('click', () => {
    if (!confirm('Clear all saved results?')) return;
    setStore('quizResults', []);
    setStore('lastAttempt', null);
    setStore(LIVE_KEY, []);
    buildAdminTable();
    buildLeaderboard();
});

document.getElementById('btnExport').addEventListener('click', () => {
    const all = getStore('quizResults', []);
    const header = ['Name', 'Class', 'Matric', 'Score', 'Total', 'Percent', 'Time(s)', 'ISO Date'];
    const rows = all.map(r => [
        r.name, r.klass, r.matric, r.score, r.total, r.pct, r.time, r.ts
    ]);
    const csv = [header].concat(rows).map(line => {
        return line.map(cell => {
            const s = String(cell ?? '');
            return `"${s.replace(/"/g, '""')}"`;
        }).join(',');
    }).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'results.csv';
    a.click();
    URL.revokeObjectURL(url);
});

/* ====== Nav buttons & In-page controls (existing code) ====== */
document.getElementById('navStart').addEventListener('click', () => showPage('page-start'));
document.getElementById('navQuiz').addEventListener('click', () => showPage('page-quiz'));
document.getElementById('navStudent').addEventListener('click', () => {
    const last = getStore('lastAttempt', null);
    if (!last) {
        alert('No attempt yet.');
        return;
    }
    buildStudentDashboard(last);
    showPage('page-student');
});
document.getElementById('navLeader').addEventListener('click', () => {
    buildLeaderboard();
    showPage('page-leader')
});
document.getElementById('navCert').addEventListener('click', () => {
    buildCert();
    showPage('page-cert')
});
document.getElementById('navAdmin').addEventListener('click', () => {
    showPage('page-admin');
    buildAdminTable();
});
document.getElementById('btnToLeaderboard').addEventListener('click', () => {
    buildLeaderboard();
    showPage('page-leader')
});
document.getElementById('btnToCert').addEventListener('click', () => {
    buildCert();
    showPage('page-cert')
});
document.getElementById('btnBackDash').addEventListener('click', () => {
    const last = getStore('lastAttempt', null);
    if (last) buildStudentDashboard(last);
    showPage('page-student')
});
document.getElementById('filterClass').addEventListener('change', buildLeaderboard);
document.getElementById('btnMyDash').addEventListener('click', () => {
    const last = getStore('lastAttempt', null);
    if (!last) {
        alert('No attempt yet.');
        return;
    }
    buildStudentDashboard(last);
    showPage('page-student');
});
document.getElementById('btnSaveCert').addEventListener('click', () => {
    const node = document.getElementById('certBox');
    html2canvas(node).then(canvas => {
        const a = document.createElement('a');
        a.download = 'certificate.png';
        a.href = canvas.toDataURL('image/png');
        a.click();
    });
});

/* ====== Auto-load leader on first open (optional) ====== */
document.addEventListener('DOMContentLoaded', () => {
    buildLeaderboard();
});
