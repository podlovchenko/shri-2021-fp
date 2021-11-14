/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */

import {
	prop,
	compose,
	propEq,
	allPass,
	equals,
	values,
	groupBy,
	mapObjIndexed,
	gte,
	partialRight,
	apply,
	props,
	not,
	partial,
	includes,
	anyPass,
	find,
	filter,
	length,
} from 'ramda';

const isWhiteCircle = propEq('circle', 'white');
const isWhiteTriangle = propEq('triangle', 'white');
const isRedStar = propEq('star', 'red');
const isGreenSquare = propEq('square', 'green');

const byColor = compose(
	mapObjIndexed((value) => value.length),
	groupBy((color) => color),
	values,
);

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = allPass([isWhiteTriangle, isWhiteCircle, isRedStar, isGreenSquare]);

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = compose(partialRight(gte, [2]), prop('green'), byColor);

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = compose(apply(equals), props(['red', 'blue']), byColor);

// 4. Синий круг, красная звезда, оранжевый квадрат
export const validateFieldN4 = allPass([
	propEq('circle', 'blue'),
	propEq('star', 'red'),
	propEq('square', 'orange'),
]);

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = compose(find(partialRight(equals, [4])), byColor);

// 6. Две зеленые фигуры (одна из них треугольник), еще одна любая красная.
export const validateFieldN6 = allPass([
	compose(partial(equals, [1]), length, partial(filter, [partialRight(equals, ['red'])]), values),
	compose(partial(equals, [2]), length, partial(filter, [partialRight(equals, ['green'])]), values),
	propEq('triangle', 'green'),
]);

// 7. Все фигуры оранжевые.
export const validateFieldN7 = compose(partialRight(equals, [4]), prop('orange'), byColor);

// 8. Не красная и не белая звезда.
export const validateFieldN8 = compose(
	not,
	anyPass([propEq('star', 'red'), propEq('star', 'white')]),
);

// 9. Все фигуры зеленые.
export const validateFieldN9 = compose(partialRight(equals, [4]), prop('green'), byColor);

// 10. Треугольник и квадрат одного цвета (не белого)
export const validateFieldN10 = compose(
	allPass([apply(equals), compose(not, partial(includes, 'white'))]),
	props(['triangle', 'square']),
);
