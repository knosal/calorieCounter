'use strict'

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
const formCalculateButton = formCounter.querySelector('.form__submit-button');
const formButtonReset = formCounter.querySelector('.form__reset-button');

const formswitcher = formCounter.querySelector('.switcher');

const genderMaleRadio = formswitcher.querySelectorAll('.switcher__item');
const maleRadio = formswitcher.querySelector('#gender-male');
const femaleRadio = formswitcher.querySelector('#gender-female');

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

let currentFactors = ActivityFactors.MINIMUM;

const onValueInputsFilled = () => {
  formInputPrameters.forEach((input) => {
    input.addEventListener('input', () => {
      isAllInputsFilled() ? formCalculateButton.removeAttribute('disabled') : formCalculateButton.setAttribute('disabled', '');
      isOneInputsFilled() ? formButtonReset.removeAttribute('disabled') : formButtonReset.setAttribute('disabled', '');
    });
  });
}

onValueInputsFilled();

const isAllInputsFilled = () => formInputPrameters.every((input) => input.value.trim() !== '');
const isOneInputsFilled = () => formInputPrameters.some((input) => input.value.trim() !== '');
const fieldReset = () => formInputPrameters.forEach((input) => input.value = '');

const buttonDisable = () => {
  formCalculateButton.setAttribute('disabled', '');
  formButtonReset.setAttribute('disabled', '');
  modalCounterResult.classList.add('counter__result--hidden');
}

const generalMaintainingWeightFormula = () => ((10 * `${inputWeightField.value}`) + (6.25 * `${inputHeightField.value}`) - (5 * `${inputAgeField.value}`));
console.log(generalMaintainingWeightFormula());
const manMaintainingWeightFormula = () => (generalMaintainingWeightFormula + 5);
const womanMaintainingWeightFormula = () => (generalMaintainingWeightFormula - 161);

exerciseAll.forEach((radioButton) => {
  radioButton.addEventListener('click', () => {
    currentFactors = ActivityFactors[radioButton.value.toUpperCase()];
    resultNorm();
  });
});
/*
const resultNorm = () => {

  if (maleRadio.checked) {
    const normCaloriesMan = manMaintainingWeightFormula() * currentFactors;
    const minCaloriesMan = normCaloriesMan - ((normCaloriesMan * 1.5) / 100);
    const maxCaloriesMan = normCaloriesMan + ((normCaloriesMan * 1.5) / 100);

    CounterCaloriesNorm.textContent = Number(normCaloriesMan);
    CounterCaloriesMin.textContent = Number(minCaloriesMan.toFixed(2));
    CounterCaloriesMax.textContent = Number(maxCaloriesMan.toFixed(2));
  } else {
    const normCaloriesWoman = womanMaintainingWeightFormula() * currentFactors;
    const minCaloriesWoman = normCaloriesWoman - ((normCaloriesWoman * 1.5) / 100);
    const maxCaloriesWoman = normCaloriesWoman + ((normCaloriesWoman * 1.5) / 100);

    CounterCaloriesNorm.textContent = Number(normCaloriesWoman);
    CounterCaloriesMin.textContent = Number(minCaloriesWoman.toFixed(2));
    CounterCaloriesMax.textContent = Number(maxCaloriesWoman.toFixed(2));
  }
}*/

const resultNorm = () => {
  if (isAllInputsFilled()) {
    const maintainingWeightFormula = maleRadio.checked ? manMaintainingWeightFormula() : womanMaintainingWeightFormula();
    const normCalories = maintainingWeightFormula * currentFactors;
    console.log(normCalories);
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
  fieldReset();
  buttonDisable();
}
formButtonReset.addEventListener('click', onResetClick);

genderMaleRadio.forEach((item) => {
  item.addEventListener('click', () => {
    exerciseMin.checked = true;
    fieldReset();
    buttonDisable();
  });
});

formCalculateButton.addEventListener('click', (evt) => {
  evt.preventDefault();
  const isContains = modalCounterResult.classList.contains('counter__result--hidden');
  if (isContains) {
    modalCounterResult.classList.remove('counter__result--hidden');
  } else {
    console.log('Обновляем рассчеты');
    resultNorm();
  }
});
