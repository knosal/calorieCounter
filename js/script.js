const LEAD_ZERO = /^0+/;
const NOT_NUMBERS = /[^\d]/g;
const CHARACTER_SPACE = /^(\d{1})(\d{3})$/;

const ActivityFactorsRatio = {
  MIN: 1.2,
  LOW: 1.375,
  MEDIUM: 1.55,
  HIGH: 1.725,
  MAX: 1.9
};

const CaloriesFormulaFactor = {
  AGE: 5,
  WEIGHT: 10,
  HEIGHT: 6.25,
};

const CaloriesFormulaConstant = {
  MALE: -5,
  FEMALE: 161
};

const CaloriesMinMaxRatio = {
  MIN: 0.85,
  MAX: 1.15
};

const formCounter = document.querySelector('.counter__form');
const formPrameters = formCounter.querySelector('.form__parameters');
const formInputFields = [...formPrameters.querySelectorAll('.form input')];
const calculateButton = formCounter.querySelector('.form__submit-button');
const resetButton = formCounter.querySelector('.form__reset-button');
const switcher = formCounter.querySelector('.switcher');
const maleRadio = switcher.querySelector('#gender-male');

const bodyMeasurementsInputs = document.querySelectorAll('.input__wrapper > input');

const exerciseRadios = document.querySelectorAll('.radio__wrapper > input');
const exerciseMin = document.querySelector('#activity-minimal');

const counterModal = document.querySelector('.counter__result');
const countertList = counterModal.querySelector('.counter__result-list');
const caloriesNorm = countertList.querySelectorAll('span[id^="calories-"]');


let currentFactors = ActivityFactorsRatio.MIN;

const getValueInputsFilled = () => {
  formInputFields.forEach((input) => {
    input.addEventListener('input', () => {
      isAllInputsFilled() ? calculateButton.removeAttribute('disabled') : calculateButton.setAttribute('disabled', '');
      isOneInputsFilled() ? resetButton.removeAttribute('disabled') : resetButton.setAttribute('disabled', '');
    });
  });
}

getValueInputsFilled();

const onDisableButton = () => {
  calculateButton.setAttribute('disabled', '');
  resetButton.setAttribute('disabled', '');
  counterModal.classList.add('counter__result--hidden');
}

const isAllInputsFilled = () => formInputFields.every((input) => input.value.trim() !== '');
const isOneInputsFilled = () => formInputFields.some((input) => input.value.trim() !== '');
const isFieldReset = () => formInputFields.forEach((input) => input.value = '');
const formatNumber = (number) => number.toString().replace(CHARACTER_SPACE, '$1 $2');
const formatInput = (input) => input.value.replace(NOT_NUMBERS, '').replace(LEAD_ZERO, '');

const getGeneralFormula = () => {
  const { WEIGHT, HEIGHT, AGE } = CaloriesFormulaFactor;

  let formattedInputs = [];
  bodyMeasurementsInputs.forEach((input) => {
    const formattedInput = formatInput(input);
    formattedInputs.push(formattedInput);
  });

  const [formattedWeight, formattedHeight, formattedAge] = formattedInputs;

  const result = ((WEIGHT * formattedWeight) + (HEIGHT * formattedHeight) - (AGE * formattedAge));
  return result;
}

const getMaintainingFormula = (value) => {
  const resultGeneralMaintainingWeight = getGeneralFormula();
  return resultGeneralMaintainingWeight + value;
}

const getManFormula = () => getMaintainingFormula(CaloriesFormulaConstant.MALE);
const getWomanFormula = () => getMaintainingFormula(CaloriesFormulaConstant.FEMALE);

const getCurrentFactors = () => {
  exerciseRadios.forEach((radioButton) => {
    radioButton.addEventListener('click', () => {
      currentFactors = ActivityFactorsRatio[radioButton.value.toUpperCase()];
    });
  });
}
getCurrentFactors();

const setResultNorm = (currentFactors) => {
  if (isAllInputsFilled()) {
    let maintainingWeightFormula = maleRadio.checked ? getManFormula() : getWomanFormula();

    if (isNaN(maintainingWeightFormula) || !maintainingWeightFormula) {
      throw new Error("Данные некорректны");
    }

    const normCalories = Math.round(maintainingWeightFormula * currentFactors);
    const minCalories = Math.round(normCalories * CaloriesMinMaxRatio.MIN);
    const maxCalories = Math.round(normCalories * CaloriesMinMaxRatio.MAX);

    const formatAndSetCalories = (element, calories) => {
      const formattedCalories = formatNumber(calories);
      element.textContent = formattedCalories;
    }

    formatAndSetCalories(caloriesNorm[0], normCalories);
    formatAndSetCalories(caloriesNorm[1], minCalories);
    formatAndSetCalories(caloriesNorm[2], maxCalories);
  }
}

const onCalculateClick = (evt) => {
  evt.preventDefault();
  const isContains = counterModal.classList.contains('counter__result--hidden');
  if (isContains) {
    counterModal.classList.remove('counter__result--hidden');
    setResultNorm(currentFactors);
  } else {
    setResultNorm(currentFactors);
  }
}

const onResetClick = () => {
  isFieldReset();
  onDisableButton();
  exerciseMin.checked = true;
  maleRadio.checked = true;
}

resetButton.addEventListener('click', onResetClick);
calculateButton.addEventListener('click', onCalculateClick);
