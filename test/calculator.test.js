import test from 'node:test';
import assert from 'node:assert/strict';
import {
  MAX_CAPACITY_LITERS,
  STEP_LITERS,
  calculateMix,
  clampToExactMixVolume,
  clampToMixerCapacity,
  getExactVolumeStep
} from '../src/calculator.js';

test('mantém a receita prime exata para 250 L de concreto', () => {
  const result = calculateMix('concrete', 250);

  assert.equal(result.totalLiters, 250);
  assert.deepEqual(result.ingredients.map((ingredient) => ingredient.liters), [37.5, 125, 62.5, 25]);
  assert.equal(result.isExact, true);
});

test('usa apenas volumes seguros que mantêm soma, passos de 0,5 L e proporção exata', () => {
  const result = calculateMix('mortar', 137.5);
  const sum = result.ingredients.reduce((total, ingredient) => total + ingredient.liters, 0);

  assert.equal(result.totalLiters, 140);
  assert.equal(sum, 140);
  assert.equal(result.isExact, true);
  result.ingredients.forEach((ingredient) => {
    assert.equal(ingredient.liters % STEP_LITERS, 0);
  });
});

test('limita volumes fora da capacidade da betoneira', () => {
  assert.equal(clampToMixerCapacity(999), MAX_CAPACITY_LITERS);
  assert.equal(clampToMixerCapacity(0), STEP_LITERS);
  assert.equal(clampToMixerCapacity(10.26), 10.5);
});

test('calcula intervalos seguros por receita', () => {
  assert.equal(getExactVolumeStep('concrete'), 10);
  assert.equal(getExactVolumeStep('mortar'), 10);
  assert.equal(getExactVolumeStep('noFines'), 5);
  assert.equal(clampToExactMixVolume('concrete', 137.5), 140);
  assert.equal(clampToExactMixVolume('noFines', 137.5), 140);
});

test('no-fines prime de 250 L usa as proporções conhecidas', () => {
  const result = calculateMix('noFines', 250);

  assert.deepEqual(result.ingredients.map((ingredient) => ingredient.liters), [25, 150, 75]);
  assert.equal(result.isExact, true);
});

test('calcula pacotes de 25 L necessários para os itens secos', () => {
  const result = calculateMix('concrete', 120);
  const [cement, aggregate, sand, water] = result.ingredients;

  // 120 L de concreto: cimento 18 L, agregado 60 L, areia 30 L, água 12 L.
  assert.equal(cement.packageUse, 18 / 25);
  assert.equal(cement.packagesNeeded, 1);
  assert.equal(aggregate.packageUse, 60 / 25);
  assert.equal(aggregate.packagesNeeded, 3);
  assert.equal(sand.packageUse, 30 / 25);
  assert.equal(sand.packagesNeeded, 2);
  assert.equal(water.packageUse, 12 / 25);
  assert.equal(water.packagesNeeded, 1);
  assert.equal(water.container, 'balde');
});

test('arredonda pacotes de 25 L para cima quando o uso é fracionado', () => {
  const result = calculateMix('concrete', 250);
  const [cement] = result.ingredients;

  // 37,5 L de cimento em pacotes de 25 L: usa 1,5 pacotes, precisa separar 2.
  assert.equal(cement.liters, 37.5);
  assert.equal(cement.packageUse, 1.5);
  assert.equal(cement.packagesNeeded, 2);
});
