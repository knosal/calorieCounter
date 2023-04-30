const ActivityFactors = {
  MIN: 1.2,
  LOW: 1.375,
  MEDIUM: 1.55,
  HIGH: 1.725,
  MAX: 1.9
};

const formCounter = document.querySelector('.counter__form');
const formPrameters = formCounter.querySelector('.form__parameters');
const formInputPrameters = [...formPrameters.querySelectorAll('.form input')];
const calculateFormButton = formCounter.querySelector('.form__submit-button');
const resetFormButton = formCounter.querySelector('.form__reset-button');
const formswitcher = formCounter.querySelector('.switcher');

const genderRadioButton = formswitcher.querySelectorAll('.switcher__item');
const gender = document.querySelector('input[name="gender"]:checked')
const maleRadio = formswitcher.querySelector('#gender-male');

const inputAgeField = formPrameters.querySelector('#age');
const inputHeightField = formPrameters.querySelector('#height');
const inputWeightField = formPrameters.querySelector('#weight');

const exerciseAll = document.querySelectorAll('.radio__wrapper > input');
const exerciseMin = document.querySelector('#activity-minimal');

const modalCounterResult = document.querySelector('.counter__result');
const counterResultList = modalCounterResult.querySelector('.counter__result-list');
const CounterCaloriesNorm = counterResultList.querySelector('#calories-norm');
const CounterCaloriesMin = counterResultList.querySelector('#calories-minimal');
const CounterCaloriesMax = counterResultList.querySelector('#calories-maximal');

let currentFactors = ActivityFactors.MIN;

const onValueInputsFilled = () => {
  formInputPrameters.forEach((input) => {
    input.addEventListener('input', () => {
      isAllInputsFilled() ? calculateFormButton.removeAttribute('disabled') : calculateFormButton.setAttribute('disabled', '');
      isOneInputsFilled() ? resetFormButton.removeAttribute('disabled') : resetFormButton.setAttribute('disabled', '');
    });
  });
}

onValueInputsFilled();

const onButtonDisable = () => {
  calculateFormButton.setAttribute('disabled', '');
  resetFormButton.setAttribute('disabled', '');
  modalCounterResult.classList.add('counter__result--hidden');
}

const isAllInputsFilled = () => formInputPrameters.every((input) => input.value.trim() !== '');
const isOneInputsFilled = () => formInputPrameters.some((input) => input.value.trim() !== '');
const isFieldReset = () => formInputPrameters.forEach((input) => input.value = '');

const getGeneralFormula = () => {
  const result = ((10 * inputWeightField.value) + (6.25 * inputHeightField.value) - (5 * inputAgeField.value));
  return result;
}

const getManFormula = () => {
  const resultGeneralMaintainingWeight = getGeneralFormula();
  const resultMan = (resultGeneralMaintainingWeight + 5);
  return resultMan;
}

const getWomanFormula = () => {
  const resultGeneralMaintainingWeight = getGeneralFormula();
  const resultWoman = (resultGeneralMaintainingWeight - 161);
  return resultWoman;
}

const currentFactorsFunction = () => {
  exerciseAll.forEach((radioButton) => {
    radioButton.addEventListener('click', () => {
      currentFactors = ActivityFactors[radioButton.value.toUpperCase()];
    });
  });
}
currentFactorsFunction();

const resultNorm = (currentFactors) => {
  if (isAllInputsFilled()) {
    let maintainingWeightFormula = maleRadio.checked ? getManFormula() : getWomanFormula();

    if (isNaN(maintainingWeightFormula) || maintainingWeightFormula === "") {
      throw new Error("Данные некорректны");
    }

    const normCalories = maintainingWeightFormula * currentFactors;
    const minCalories = normCalories - ((normCalories * 1.5) / 100);
    const maxCalories = normCalories + ((normCalories * 1.5) / 100);

    CounterCaloriesNorm.textContent = normCalories.toFixed(2);
    CounterCaloriesMin.textContent = minCalories.toFixed(2);
    CounterCaloriesMax.textContent = maxCalories.toFixed(2);
  }
}

const onResetClick = () => {
  maleRadio.checked = true;
  exerciseMin.checked = true;
  isFieldReset();
  onButtonDisable();
}

const onCalculateClick = (evt) => {
  evt.preventDefault();
  const isContains = modalCounterResult.classList.contains('counter__result--hidden');
  if (isContains) {
    modalCounterResult.classList.remove('counter__result--hidden');
    resultNorm(currentFactors);
  } else {
    resultNorm(currentFactors);
  }
}

genderRadioButton.forEach((item) => {
  item.addEventListener('click', () => {
    if (gender === 'male') {
      return;
    }
  });
});

calculateFormButton.addEventListener('click', onCalculateClick);
resetFormButton.addEventListener('click', onResetClick);
