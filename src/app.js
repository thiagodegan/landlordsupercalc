import { MIXES, calculateMix, clampToMixerCapacity, formatLiters } from './calculator.js';

const mixType = document.querySelector('#mix-type');
const targetLiters = document.querySelector('#target-liters');
const targetRange = document.querySelector('#target-range');
const resultTitle = document.querySelector('#result-title');
const totalBadge = document.querySelector('#total-badge');
const ingredients = document.querySelector('#ingredients');
const notice = document.querySelector('#notice');

Object.entries(MIXES).forEach(([key, mix]) => {
  const option = document.createElement('option');
  option.value = key;
  option.textContent = mix.label;
  mixType.append(option);
});

function syncVolume(value) {
  const clampedValue = clampToMixerCapacity(value);
  targetLiters.value = clampedValue;
  targetRange.value = clampedValue;
  render();
}

function render() {
  const result = calculateMix(mixType.value, targetLiters.value);
  const total = formatLiters(result.totalLiters);

  resultTitle.textContent = `${result.label} — ${total} L`;
  totalBadge.textContent = `${total} L`;

  ingredients.innerHTML = '';
  result.ingredients.forEach((ingredient) => {
    const row = document.createElement('article');
    row.className = 'ingredient';

    const title = document.createElement('h3');
    title.textContent = ingredient.label;

    const amount = document.createElement('strong');
    amount.textContent = `${formatLiters(ingredient.liters)} L`;

    const meta = document.createElement('p');
    meta.textContent = `${ingredient.percent.toFixed(1).replace('.', ',')}% do mix`;

    row.append(title, amount, meta);
    ingredients.append(row);
  });

  notice.className = result.isExact ? 'notice success' : 'notice warning';
  notice.textContent = result.isExact
    ? 'Esta quantidade mantém exatamente a proporção prime e todos os ingredientes são múltiplos de 0,5 L.'
    : 'A proporção foi aproximada para que todos os ingredientes fiquem em múltiplos de 0,5 L sem passar do total escolhido.';
}

mixType.addEventListener('change', render);
targetLiters.addEventListener('change', (event) => syncVolume(event.target.value));
targetLiters.addEventListener('input', (event) => {
  targetRange.value = clampToMixerCapacity(event.target.value);
  render();
});
targetRange.addEventListener('input', (event) => syncVolume(event.target.value));

document.querySelectorAll('[data-volume]').forEach((button) => {
  button.addEventListener('click', () => syncVolume(button.dataset.volume));
});

syncVolume(targetLiters.value);
