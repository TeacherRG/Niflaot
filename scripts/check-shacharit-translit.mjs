import assert from 'node:assert/strict';
import { translitSiddurToken } from '../src/core/tehillimTranslit.ts';

assert.equal(translitSiddurToken('יְיָ־אֱלֹהֶיךָ', 'en'), 'Adonoi-Eloheicho');
assert.notEqual(translitSiddurToken('שָׁלוֹם', 'ru'), translitSiddurToken('שָׁלוֹם', 'ru', 'sef'));
