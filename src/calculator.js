export const MAX_CAPACITY_LITERS = 250;
export const STEP_LITERS = 0.5;

export const MIXES = {
  concrete: {
    label: 'Concreto prime',
    ingredients: [
      { key: 'cement', label: 'Cimento', ratio: 37.5 },
      { key: 'aggregate', label: 'Agregado', ratio: 125 },
      { key: 'sand', label: 'Areia', ratio: 62.5 },
      { key: 'water', label: 'Água', ratio: 25 }
    ]
  },
  mortar: {
    label: 'Argamassa prime',
    ingredients: [
      { key: 'cement', label: 'Cimento', ratio: 37.5 },
      { key: 'sand', label: 'Areia', ratio: 187.5 },
      { key: 'water', label: 'Água', ratio: 25 }
    ]
  },
  noFines: {
    label: 'No-fines prime',
    ingredients: [
      { key: 'cement', label: 'Cimento', ratio: 25 },
      { key: 'aggregate', label: 'Agregado', ratio: 150 },
      { key: 'water', label: 'Água', ratio: 75 }
    ]
  }
};

export function clampToMixerCapacity(value) {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return MAX_CAPACITY_LITERS;
  }

  const roundedToStep = Math.round(numericValue / STEP_LITERS) * STEP_LITERS;
  return Math.min(MAX_CAPACITY_LITERS, Math.max(STEP_LITERS, roundedToStep));
}

export function calculateMix(mixKey, requestedLiters) {
  const mix = MIXES[mixKey];

  if (!mix) {
    throw new Error(`Tipo de mistura desconhecido: ${mixKey}`);
  }

  const totalLiters = clampToMixerCapacity(requestedLiters);
  const totalUnits = Math.round(totalLiters / STEP_LITERS);
  const ratioTotal = mix.ingredients.reduce((total, ingredient) => total + ingredient.ratio, 0);

  const withUnits = mix.ingredients.map((ingredient) => {
    const exactUnits = (ingredient.ratio / ratioTotal) * totalUnits;

    return {
      ...ingredient,
      exactLiters: exactUnits * STEP_LITERS,
      units: Math.floor(exactUnits),
      remainder: exactUnits - Math.floor(exactUnits)
    };
  });

  let unitsToDistribute = totalUnits - withUnits.reduce((total, ingredient) => total + ingredient.units, 0);

  withUnits
    .sort((a, b) => b.remainder - a.remainder || b.ratio - a.ratio)
    .forEach((ingredient) => {
      if (unitsToDistribute > 0) {
        ingredient.units += 1;
        unitsToDistribute -= 1;
      }
    });

  const ingredients = withUnits
    .sort((a, b) => mix.ingredients.findIndex((ingredient) => ingredient.key === a.key) - mix.ingredients.findIndex((ingredient) => ingredient.key === b.key))
    .map((ingredient) => ({
      key: ingredient.key,
      label: ingredient.label,
      liters: ingredient.units * STEP_LITERS,
      exactLiters: ingredient.exactLiters,
      percent: totalLiters === 0 ? 0 : (ingredient.units * STEP_LITERS * 100) / totalLiters,
      isExact: Math.abs(ingredient.units * STEP_LITERS - ingredient.exactLiters) < Number.EPSILON
    }));

  return {
    mixKey,
    label: mix.label,
    requestedLiters: Number(requestedLiters),
    totalLiters,
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
