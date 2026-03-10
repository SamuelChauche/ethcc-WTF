import './style.css';
import { preloadImages } from './game';
import { showStartScreen, setupKeyboard } from './ui';

preloadImages();
showStartScreen();
setupKeyboard();

// Random tip emoji (à la web3.bio)
const TIPS = ["☕️","🍵","🧋","🍗","🍭","🧁","🍩","🍕","🍪","🍺","🌹","💎","🚀"];
document.querySelector('.tip-emoji')!.textContent = TIPS[Math.floor(Math.random() * TIPS.length)];
