const ActivityFactors = {
  MIN: 1.2,
  LOW: 1.375,
  MEDIUM: 1.55,
  HIGH: 1.725,
  MAX: 1.9
};

const formCounter = document.querySelector('.counter__form');
const formPrameters = formCounter.querySelector('.form__parameters');
const formInputFields = [...formPrameters.querySelectorAll('.form input')];
const calculateButton = formCounter.querySelector('.form__submit-button');
const resetButton = formCounter.querySelector('.form__reset-button');
const switcher = formCounter.querySelector('.switcher');

const genderRadios = switcher.querySelectorAll('.switcher__item');
const maleRadio = switcher.querySelector('#gender-male');

const ageInput = formPrameters.querySelector('#age');
const heightInput = formPrameters.querySelector('#height');
const weightInput = formPrameters.querySelector('#weight');

const exerciseRadios = document.querySelectorAll('.radio__wrapper > input');
const exerciseMin = document.querySelector('#activity-minimal');

const counterResultModal = document.querySelector('.counter__result');
const counterResultList = counterResultModal.querySelector('.counter__result-list');
const caloriesNorm = counterResultList.querySelector('#calories-norm');
const caloriesMin = counterResultList.querySelector('#calories-minimal');
const caloriesMax = counterResultList.querySelector('#calories-maximal');

let currentFactors = ActivityFactors.MIN;

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
  counterResultModal.classList.add('counter__result--hidden');
}

const isAllInputsFilled = () => formInputFields.every((input) => input.value.trim() !== '');
const isOneInputsFilled = () => formInputFields.some((input) => input.value.trim() !== '');
const isFieldReset = () => formInputFields.forEach((input) => input.value = '');

const getGeneralFormula = () => {
  const result = ((10 * weightInput.value) + (6.25 * heightInput.value) - (5 * ageInput.value));
  return result;
}

const getMaintainingFormula = (value) => {
  const resultGeneralMaintainingWeight = getGeneralFormula();
  return resultGeneralMaintainingWeight + value;
}

const getManFormula = () => getMaintainingFormula(5);
const getWomanFormula = () => getMaintainingFormula(-161);


const getCurrentFactors = () => {
  exerciseRadios.forEach((radioButton) => {
    radioButton.addEventListener('click', () => {
      currentFactors = ActivityFactors[radioButton.value.toUpperCase()];
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

    const normCalories = maintainingWeightFormula * currentFactors;
    const minCalories = normCalories - ((normCalories * 1.5) / 100);
    const maxCalories = normCalories + ((normCalories * 1.5) / 100);

    caloriesNorm.textContent = normCalories.toFixed(2);
    caloriesMin.textContent = minCalories.toFixed(2);
    caloriesMax.textContent = maxCalories.toFixed(2);
  }
}

const onCalculateClick = (evt) => {
  evt.preventDefault();
  const isContains = counterResultModal.classList.contains('counter__result--hidden');
  if (isContains) {
    counterResultModal.classList.remove('counter__result--hidden');
    setResultNorm(currentFactors);
  } else {
    setResultNorm(currentFactors);
  }
}

const resetFields = () => {
  isFieldReset();
  onDisableButton();
  exerciseMin.checked = true;
}

const onResetClick = () => {
  resetFields();
  maleRadio.checked = true;
}

genderRadios.forEach((item) => item.addEventListener('click', () => resetFields()));
resetButton.addEventListener('click', onResetClick);
calculateButton.addEventListener('click', onCalculateClick);
