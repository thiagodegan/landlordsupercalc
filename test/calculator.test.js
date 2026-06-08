import test from 'node:test';
import assert from 'node:assert/strict';
import { MAX_CAPACITY_LITERS, STEP_LITERS, calculateMix, clampToMixerCapacity } from '../src/calculator.js';

test('mantém a receita prime exata para 250 L de concreto', () => {
  const result = calculateMix('concrete', 250);

  assert.equal(result.totalLiters, 250);
  assert.deepEqual(result.ingredients.map((ingredient) => ingredient.liters), [37.5, 125, 62.5, 25]);
  assert.equal(result.isExact, true);
});

test('mantém a soma no total escolhido e todos os ingredientes em passos de 0,5 L', () => {
  const result = calculateMix('mortar', 137.5);
  const sum = result.ingredients.reduce((total, ingredient) => total + ingredient.liters, 0);

  assert.equal(sum, 137.5);
  result.ingredients.forEach((ingredient) => {
    assert.equal(ingredient.liters % STEP_LITERS, 0);
  });
});

test('limita volumes fora da capacidade da betoneira', () => {
  assert.equal(clampToMixerCapacity(999), MAX_CAPACITY_LITERS);
  assert.equal(clampToMixerCapacity(0), STEP_LITERS);
  assert.equal(clampToMixerCapacity(10.26), 10.5);
});

test('no-fines prime de 250 L usa as proporções conhecidas', () => {
  const result = calculateMix('noFines', 250);

  assert.deepEqual(result.ingredients.map((ingredient) => ingredient.liters), [25, 150, 75]);
  assert.equal(result.isExact, true);
});
