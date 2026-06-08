import { MIXES, calculateMix, clampToExactMixVolume, formatLiters, formatNumber } from './calculator.js';

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

function updateVolumeControls(result) {
  targetLiters.min = result.totalStepLiters;
  targetLiters.step = result.totalStepLiters;
  targetRange.min = result.totalStepLiters;
  targetRange.step = result.totalStepLiters;
}

function syncVolume(value) {
  const clampedValue = clampToExactMixVolume(mixType.value, value);
  targetLiters.value = clampedValue;
  targetRange.value = clampedValue;
  render();
}

function renderPackageInfo(ingredient) {
  if (ingredient.packageUse === null) {
    return 'Sem pacote: medir direto em litros';
  }

  const packageWord = ingredient.packagesNeeded === 1 ? 'pacote' : 'pacotes';
  return `${ingredient.packagesNeeded} ${packageWord} para ter material suficiente · usar ${formatNumber(ingredient.packageUse)} ${packageWord}`;
}

function render() {
  const result = calculateMix(mixType.value, targetLiters.value);
  const total = formatLiters(result.totalLiters);

  updateVolumeControls(result);
  targetRange.value = result.totalLiters;
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

    const packages = document.createElement('p');
    packages.className = 'package-info';
    packages.textContent = renderPackageInfo(ingredient);

    row.append(title, amount, meta, packages);
    ingredients.append(row);
  });

  notice.className = 'notice success';
  notice.textContent = `Este mix só incrementa em intervalos seguros de ${formatLiters(result.totalStepLiters)} L, então a proporção prime não é quebrada e todos os ingredientes continuam em múltiplos de 0,5 L.`;
}

mixType.addEventListener('change', () => syncVolume(targetLiters.value));
targetLiters.addEventListener('change', (event) => syncVolume(event.target.value));
targetLiters.addEventListener('input', (event) => {
  targetRange.value = clampToExactMixVolume(mixType.value, event.target.value);
  render();
});
targetRange.addEventListener('input', (event) => syncVolume(event.target.value));

document.querySelectorAll('[data-volume]').forEach((button) => {
  button.addEventListener('click', () => syncVolume(button.dataset.volume));
});

syncVolume(targetLiters.value);
