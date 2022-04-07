import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './js/fetchCountries';

const DEBOUNCE_DELAY = 300;

const searchEl = document.querySelector('#search-box');
const countryInfo = document.querySelector('.country-info');
const countryList = document.querySelector('.country-list');

searchEl.addEventListener('input', debounce(handleInput, DEBOUNCE_DELAY));

function handleInput(event) {
  event.preventDefault();
  const inputValue = event.target.value.trim().toLowerCase();

  if (inputValue === '') {
    countryInfo = '';
    countryList = '';
    return;
  }
  fetchCountries(`${inputValue}`)
    .then(renderMarkup)
    .catch(onFetchError)
    .finally(() => form.reset());
}

function renderMarkup(serverDataList) {
  if (serverDataList.length > 10) {
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
    Notify.info('Too many matches found. Please enter a more specific name.');
    return;
  } else if (serverDataList.length === 1) {
    countryInfo.innerHTML = countryInfoMarkup(serverDataList[0]);
    countryList.innerHTML = '';
    return;
  } else {
    countryInfo.innerHTML = '';
    countryList.innerHTML = countryListMarkup(serverDataList);
  }
}

function onFetchError(error) {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
  Notify.failure('Oops, there is no country with that name.');
}

function countryListMarkup(serverDataList) {
  return serverDataList
    .map(({ flags, name }) => {
      return `<li>
           <img src="${flags.svg}" alt="Flag of ${name.official}" width ="70" height="50">
           <p><b>${name.official}</b></p>
           </li>`;
    })
    .join('');
}

function countryInfoMarkup({ name, flags, capital, population, languages }) {
  const countryLanguages = Object.values(languages).join(', ');

  return `<div>
   <img src="${flags.svg}" alt="Flag of ${name.official}. width ="200" height="180">
   <h1>${name.official}</h1>
   </div>
   <p><b>Capital:</b> ${capital}</p>
   <p><b>Population:</b> ${population}</p>
   <p><b>Languages:</b> ${countryLanguages}</p>`;
}
