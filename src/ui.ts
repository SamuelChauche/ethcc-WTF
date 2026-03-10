import { speakers } from './data';
import { state, resetState, getCurrentSpeaker, generateOptions, totalSpeakers } from './game';
import { launchConfetti } from './confetti';

const FALLBACK_SVG = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'><rect width='200' height='200' fill='%23181825'/><circle cx='100' cy='72' r='32' fill='%237c3aed' opacity='.4'/><ellipse cx='100' cy='148' rx='48' ry='32' fill='%237c3aed' opacity='.2'/><text x='100' y='108' text-anchor='middle' font-size='36' fill='%23a855f7' font-family='system-ui'>?</text></svg>`;

const SUSPENSE_DELAY = 800; // ms of suspense before revealing answer

// ── DOM helpers ──

function $(id: string): HTMLElement {
  return document.getElementById(id)!;
}

function updateHeader(): void {
  const pos = state.current + 1;
  const total = totalSpeakers();
  $('counter').textContent = `${pos} / ${total}`;
  $('score-display').textContent = String(state.score);
  const pct = (state.current / total) * 100;
  const bar = $('progress-bar');
  bar.style.width = `${pct}%`;
  bar.parentElement!.setAttribute('aria-valuenow', String(Math.round(pct)));
}

function bumpScore(): void {
  const pill = $('score-display');
  pill.classList.remove('bump');
  void (pill as HTMLElement).offsetWidth; // force reflow
  pill.classList.add('bump');
}

// ── Start screen ──

export function showStartScreen(): void {
  const projectCount = new Set(speakers.map((s) => s.project)).size;
  $('game-area').innerHTML = `
    <div id="start-screen">
      <div class="start-icon">\u{1F3AD}</div>
      <div class="start-title">EthCC Who's This Face</div>
      <p class="start-subtitle">
        Can you identify the <strong>${speakers.length} speakers</strong> of EthCC Cannes 2026?
        Test your knowledge of the Web3 ecosystem.
      </p>
      <div class="start-stats">
        <div class="start-stat">
          <span class="start-stat-num">${speakers.length}</span>
          <span class="start-stat-label">Speakers</span>
        </div>
        <div class="start-stat">
          <span class="start-stat-num">${projectCount}</span>
          <span class="start-stat-label">Projects</span>
        </div>
        <div class="start-stat">
          <span class="start-stat-num">2</span>
          <span class="start-stat-label">Choices</span>
        </div>
      </div>
      <button class="btn-start" id="btn-start-game" autofocus>Start the Quiz</button>
    </div>
  `;
  $('btn-start-game').addEventListener('click', startGame);
}

// ── Game card ──

function showCard(): void {
  state.answered = false;
  const person = getCurrentSpeaker();
  const options = generateOptions();
  updateHeader();

  $('game-area').innerHTML = `
    <div class="card" id="current-card">
      <p class="question-hint">Who is this person?</p>
      <div class="photo-wrap">
        <img
          class="photo-hex"
          src="${person.photo || FALLBACK_SVG}"
          alt="Speaker photo"
          loading="eager"
        />
      </div>
      <span class="role-badge">${person.role}</span>
      <div class="feedback" id="feedback"></div>
      <div class="btn-group" id="btn-group">
        <button class="btn btn-name" data-correct="${options[0].correct}">
          <span class="arrow-hint">\u2190</span>${options[0].label}
        </button>
        <button class="btn btn-name" data-correct="${options[1].correct}">
          ${options[1].label}<span class="arrow-hint">\u2192</span>
        </button>
      </div>
      <div class="kbd-hint"><kbd>\u2190</kbd> or <kbd>\u2192</kbd> to choose &bull; <kbd>Enter</kbd> for next</div>
    </div>
  `;

  // Fallback for broken images
  const img = document.querySelector('.photo-hex') as HTMLImageElement;
  img.addEventListener('error', () => { img.src = FALLBACK_SVG; });

  // Button click handlers
  const buttons = document.querySelectorAll<HTMLButtonElement>('.btn-name');
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => handleAnswer(btn));
  });
}

// ── Answer handler with suspense ──

function handleAnswer(clickedBtn: HTMLButtonElement): void {
  if (state.answered) return;
  state.answered = true;

  const isCorrect = clickedBtn.dataset.correct === 'true';
  const buttons = document.querySelectorAll<HTMLButtonElement>('.btn-name');

  // Phase 1: highlight the clicked button, disable both — SUSPENSE
  buttons.forEach((btn) => {
    btn.disabled = true;
    btn.classList.add('locked');
  });
  clickedBtn.classList.add('selected');

  // After suspense delay, reveal the result
  setTimeout(() => revealAnswer(isCorrect), SUSPENSE_DELAY);
}

function revealAnswer(isCorrect: boolean): void {
  const person = getCurrentSpeaker();
  const card = document.getElementById('current-card');
  const feedback = $('feedback');
  const info = `<strong>${person.name}</strong> — ${person.project}<span class="sector-tag">${person.sector}</span>`;

  const buttons = document.querySelectorAll<HTMLButtonElement>('.btn-name');

  // Show correct/wrong on buttons
  buttons.forEach((btn) => {
    if (btn.dataset.correct === 'true') {
      btn.classList.add('btn-correct');
    } else {
      btn.classList.add('btn-wrong');
    }
  });

  if (card) {
    card.style.animation = 'none';
    void (card as HTMLElement).offsetWidth;
  }

  if (isCorrect) {
    state.score++;
    feedback.className = 'feedback good';
    feedback.innerHTML = `<span class="emoji">\u{1F389}</span> Correct! ${info}`;
    card?.classList.add('pulse');
    launchConfetti();
    $('score-display').textContent = String(state.score);
    bumpScore();
  } else {
    feedback.className = 'feedback bad';
    feedback.innerHTML = `<span class="emoji">\u274C</span> Wrong! It was ${info}`;
    card?.classList.add('shake');
    setTimeout(() => card?.classList.remove('shake'), 520);
  }

  $('btn-group').innerHTML =
    `<button class="btn btn-next" id="btn-next">Next \u2192</button>`;
  $('btn-next').addEventListener('click', nextCard);
}

// ── Navigation ──

function nextCard(): void {
  state.current++;
  if (state.current >= totalSpeakers()) {
    showEndScreen();
  } else {
    showCard();
  }
}

// ── End screen ──

function showEndScreen(): void {
  state.started = false;
  $('game-area').innerHTML = '';
  $('progress-bar').style.width = '100%';
  $('counter').textContent = `${totalSpeakers()} / ${totalSpeakers()}`;
  $('score-display').textContent = String(state.score);

  const endScreen = $('end-screen');
  endScreen.style.display = 'flex';
  const total = totalSpeakers();
  $('end-score').innerHTML = `${state.score} <span>/ ${total}</span>`;

  const pct = Math.round((state.score / total) * 100);
  const bar = $('end-bar') as HTMLElement;
  const hue = pct >= 75 ? 'var(--green)' : pct >= 50 ? 'var(--gold)' : 'var(--red)';
  bar.style.background = hue;
  setTimeout(() => { bar.style.width = `${pct}%`; }, 100);

  const messages: [number, string][] = [
    [total,                '\u{1F3C6} Perfect! You deserve an "OG EthCC Cannes" badge. Vitalik respects you.'],
    [Math.ceil(total * 0.85), '\u{1F525} Impressive! You clearly spend too much time in the Web3 conference lobby.'],
    [Math.ceil(total * 0.7),  '\u{1F60E} Not bad at all! You pass for an insider. We believe you.'],
    [Math.ceil(total * 0.5),  '\u{1F914} Meh... You\'ve obviously skipped a few EthCCs. Shame.'],
    [Math.ceil(total * 0.3),  '\u{1F605} You\'ve seen too few stages. Stop hanging out at the pool party.'],
    [0,                       '\u{1F480} You\'d confuse Vitalik with an NFT influencer. Come back when you\'ve done your homework.'],
  ];
  const msg = messages.find(([min]) => state.score >= min);
  $('end-message').textContent = msg ? msg[1] : '';

  if (state.score >= Math.ceil(total * 0.75)) launchConfetti(5000);
}

// ── Start / restart ──

export function startGame(): void {
  resetState();
  $('end-screen').style.display = 'none';
  $('progress-bar').style.width = '0%';
  showCard();
}

// ── Keyboard support ──

export function setupKeyboard(): void {
  document.addEventListener('keydown', (e: KeyboardEvent) => {
    if (!state.started) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        startGame();
      }
      return;
    }

    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      const btns = document.querySelectorAll<HTMLButtonElement>('.btn-name');
      const idx = e.key === 'ArrowLeft' ? 0 : 1;
      if (btns[idx] && !btns[idx].disabled) btns[idx].click();
    }

    if (e.key === 'Enter' || e.key === ' ') {
      const nextBtn = document.getElementById('btn-next');
      if (nextBtn) {
        e.preventDefault();
        nextBtn.click();
      }
      const endScreen = $('end-screen');
      const replayBtn = document.getElementById('btn-replay');
      if (replayBtn && endScreen.style.display === 'flex') {
        e.preventDefault();
        replayBtn.click();
      }
    }
  });

  // Replay button on end screen
  $('btn-replay').addEventListener('click', startGame);
}
