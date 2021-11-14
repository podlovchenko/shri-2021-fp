/**
 * @file Домашка по FP ч. 2
 *
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 *
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 *
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */
import Api from '../tools/api';
import {
	allPass,
	andThen,
	compose,
	gt,
	ifElse,
	length,
	lt,
	lte,
	match,
	modulo,
	partial,
	partialRight,
	prop,
	tap,
} from 'ramda';
import { round } from 'lodash';

const api = new Api();

const isValidString = compose(allPass([gt(10), lt(2)]), length);
const isPositiveNumber = lte(0);
const isFloatNumber = match(/^[0-9]*\.?[0-9]*$/);

const isValidValue = allPass([isValidString, isPositiveNumber, tap(console.log), isFloatNumber]);

const parseInput = compose(round, parseFloat);

const getNumberFromApi = api.get('https://api.tech/numbers/base');
const convertNumberToBinary = (value) => getNumberFromApi({ from: 10, to: 2, number: value });
const getAnimalById = (id) => api.get(`https://animals.tech/${id}`)({});

const squareNumber = partialRight(Math.pow, [2]);
const moduloTree = partialRight(modulo, [3]);

const getResult = prop('result');

const processSequence = ({ value, writeLog, handleSuccess, handleError }) => {
	const validationError = partial(handleError, ['ValidationError']);

	compose(
		ifElse(
			isValidValue,
			compose(
				andThen(handleSuccess),
				andThen(getResult),
				andThen(getAnimalById),
				andThen(tap(writeLog)),
				andThen(moduloTree),
				andThen(tap(writeLog)),
				andThen(squareNumber),
				andThen(tap(writeLog)),
				andThen(length),
				andThen(tap(writeLog)),
				andThen(getResult),
				convertNumberToBinary,
				tap(writeLog),
				parseInput,
			),
			tap(validationError),
		),
		tap(writeLog),
	)(value);
};

export default processSequence;
