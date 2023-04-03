"use strict";
const theme = document.querySelector(".btn-theme");
let countryData;

async function getData() {
  const key = window.location.href.slice(-3);
  if (JSON.parse(localStorage.getItem("darkMode"))) {
    document.body.classList.add("dark");
  }
  if (localStorage.getItem("data")) {
    countryData = JSON.parse(localStorage.getItem("data"));
  }
  displayCountryDetails(countryData[key]);
}
getData();

theme.addEventListener("click", changeTheme);

function displayCountryDetails(data) {
  document.title = `${data.name}`;
  countryDetailsCard(data);
}
function goBack() {
  document.querySelector(".country-card").remove();
}
function countryDetailsCard(data) {
  if (document.querySelector(".country-card")) {
    document.querySelector(".country-card").remove();
  }
  setTimeout(() => {
    let borders = data?.borders ? displayBorders(data.borders) : "hidden";
    const card = `<main class="country-card">
        <a class="btn btn-back fromLeft delay--3" href="/">Back</a>
        <figure class="country-details">
          <img class="flag fromLeft" src="${handleUndefined(
            data.flag.svg,
            data.flag.png
          )}" alt="" />
          <div class="details">
            <h2 class="fromRight">${data.name}</h2>
            <div class="first fromRight delay--1">
              <p>Native Name:<span>${handleUndefined(
                data.nativeName
              )}</span></p>
              <p>Population:<span>${new Intl.NumberFormat().format(
                data.population
              )}</span></p>
              <p>Region:<span>${handleUndefined(data.region)}</span></p>
              <p>Sub Region:<span>${handleUndefined(data.subregion)}</span></p>
              <p>Capital:<span>${handleUndefined(data.capital)}</span></p>
            </div>
            <div class="second fromRight delay--2">
              <p>Top Level Domain:<span>${handleUndefined(
                data.topLevelDomain
              )}</span></p>
              <p>Currencies:<span>${handleUndefined(data.currencies)}</span></p>
              <p>Languages:<span>${handleUndefined(data.languages)}</span></p>
            </div>
            <div class="borders fromRight delay--3 ${
              borders == "hidden" ? borders : ""
            }">
              <p>Border Countries:</p>
              ${borders}
            </div>
          </div>
        </figure>
    </main>`;
    document.body.insertAdjacentHTML("beforeend", card);
  }, 0);
}
function displayBorders(data) {
  if (!data) return;
  let str = "";
  data.forEach((el) => {
    str += `<button class="btn btn-border" onclick="displayCountryDetails(countryData['${el}'])">${countryData[el].name}</button>`;
  });
  return str;
}
function handleUndefined(data, value = "-") {
  return data ? data : value;
}
function changeTheme() {
  if (document.body.classList.toggle("dark")) {
    localStorage.setItem("darkMode", true);
  } else {
    localStorage.setItem("darkMode", false);
  }
}
