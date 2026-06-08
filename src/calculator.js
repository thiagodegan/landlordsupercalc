export const MAX_CAPACITY_LITERS = 250;
export const STEP_LITERS = 0.5;
export const PACKAGE_LITERS = 25;

const PACKAGE = 'pacote';
const BUCKET = 'balde';

export const MIXES = {
  concrete: {
    label: 'Concreto prime',
    ingredients: [
      { key: 'cement', label: 'Cimento', ratio: 37.5, packageLiters: PACKAGE_LITERS, container: PACKAGE },
      { key: 'aggregate', label: 'Agregado', ratio: 125, packageLiters: PACKAGE_LITERS, container: PACKAGE },
      { key: 'sand', label: 'Areia', ratio: 62.5, packageLiters: PACKAGE_LITERS, container: PACKAGE },
      { key: 'water', label: 'Água', ratio: 25, packageLiters: PACKAGE_LITERS, container: BUCKET }
    ]
  },
  mortar: {
    label: 'Argamassa prime',
    ingredients: [
      { key: 'cement', label: 'Cimento', ratio: 37.5, packageLiters: PACKAGE_LITERS, container: PACKAGE },
      { key: 'sand', label: 'Areia', ratio: 187.5, packageLiters: PACKAGE_LITERS, container: PACKAGE },
      { key: 'water', label: 'Água', ratio: 25, packageLiters: PACKAGE_LITERS, container: BUCKET }
    ]
  },
  noFines: {
    label: 'No-fines prime',
    ingredients: [
      { key: 'cement', label: 'Cimento', ratio: 25, packageLiters: PACKAGE_LITERS, container: PACKAGE },
      { key: 'aggregate', label: 'Agregado', ratio: 150, packageLiters: PACKAGE_LITERS, container: PACKAGE },
      { key: 'water', label: 'Água', ratio: 75, packageLiters: PACKAGE_LITERS, container: BUCKET }
    ]
  }
};

function greatestCommonDivisor(firstValue, secondValue) {
  let first = Math.abs(firstValue);
  let second = Math.abs(secondValue);

  while (second !== 0) {
    const remainder = first % second;
    first = second;
    second = remainder;
  }

  return first;
}

function roundToStep(value, step = STEP_LITERS) {
  return Math.round(value / step) * step;
}

function getMix(mixKey) {
  const mix = MIXES[mixKey];

  if (!mix) {
    throw new Error(`Tipo de mistura desconhecido: ${mixKey}`);
  }

  return mix;
}

export function getExactVolumeStep(mixKey) {
  const mix = getMix(mixKey);
  const ratioUnits = mix.ingredients.map((ingredient) => Math.round(ingredient.ratio / STEP_LITERS));
  const ratioDivisor = ratioUnits.reduce((divisor, units) => greatestCommonDivisor(divisor, units));
  const normalizedTotalUnits = ratioUnits.reduce((total, units) => total + units / ratioDivisor, 0);

  return normalizedTotalUnits * STEP_LITERS;
}

export function clampToMixerCapacity(value) {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return MAX_CAPACITY_LITERS;
  }

  const roundedToStep = roundToStep(numericValue);
  return Math.min(MAX_CAPACITY_LITERS, Math.max(STEP_LITERS, roundedToStep));
}

export function clampToExactMixVolume(mixKey, value) {
  const exactStep = getExactVolumeStep(mixKey);
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return MAX_CAPACITY_LITERS;
  }

  const roundedToExactStep = roundToStep(numericValue, exactStep);
  return Math.min(MAX_CAPACITY_LITERS, Math.max(exactStep, roundedToExactStep));
}

export function calculateMix(mixKey, requestedLiters) {
  const mix = getMix(mixKey);
  const totalStepLiters = getExactVolumeStep(mixKey);
  const totalLiters = clampToExactMixVolume(mixKey, requestedLiters);
  const ratioTotal = mix.ingredients.reduce((total, ingredient) => total + ingredient.ratio, 0);

  const ingredients = mix.ingredients.map((ingredient) => {
    const exactLiters = (ingredient.ratio / ratioTotal) * totalLiters;
    const liters = roundToStep(exactLiters);
    const packageUse = ingredient.packageLiters
      ? liters / ingredient.packageLiters
      : null;

    return {
      key: ingredient.key,
      label: ingredient.label,
      liters,
      exactLiters,
      percent: (liters * 100) / totalLiters,
      container: ingredient.container ?? null,
      packageUse,
      packagesNeeded: packageUse === null ? null : Math.ceil(packageUse - Number.EPSILON),
      isExact: Math.abs(liters - exactLiters) < Number.EPSILON
    };
  });

  return {
    mixKey,
    label: mix.label,
    requestedLiters: Number(requestedLiters),
    totalLiters,
    totalStepLiters,
    ingredients,
    isExact: ingredients.every((ingredient) => ingredient.isExact)
  };
}

export function formatLiters(value) {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: value % 1 === 0 ? 0 : 1,
    maximumFractionDigits: 1
  }).format(value);
}

export function formatNumber(value, maximumFractionDigits = 2) {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: value % 1 === 0 ? 0 : 1,
    maximumFractionDigits
  }).format(value);
}
