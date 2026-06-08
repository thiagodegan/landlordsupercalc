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

test('calcula pacotes necessários para os itens secos', () => {
  const result = calculateMix('concrete', 120);
  const [cement, aggregate, sand, water] = result.ingredients;

  assert.equal(cement.packageUse, 0.48);
  assert.equal(cement.packagesNeeded, 1);
  assert.equal(aggregate.packageUse, 1.92);
  assert.equal(aggregate.packagesNeeded, 2);
  assert.equal(sand.packageUse, 0.96);
  assert.equal(sand.packagesNeeded, 1);
  assert.equal(water.packageUse, null);
  assert.equal(water.packagesNeeded, null);
});
