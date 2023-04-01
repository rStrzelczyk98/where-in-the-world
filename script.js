"use strict";

const filter = document.querySelector(".btn-filter");
const search = document.getElementById("search");
const content = document.querySelector(".box");
const main = document.querySelector(".content");
let countryData = {};

window.addEventListener("load", getData);
filter.addEventListener("click", filterBy.bind(this));
search.addEventListener("input", searchCountry);
document.addEventListener("click", display.bind(this));
document.addEventListener("keydown", function (e) {
  if (e.key === "Backspace") changeRegion();
});

function display(e) {
  if (e.target.closest(".card")) {
    const key = e.target.closest(".card").id.slice(-3);
    displayCountryDetails(countryData[key]);
  }
}

async function getData() {
  if (localStorage.getItem("data")) {
    countryData = JSON.parse(localStorage.getItem("data"));
  } else {
    const data = await fetch("https://restcountries.com/v3.1/all");
    const dataJSON = await data.json();
    dataJSON.forEach((el) => countryDetails(el));
    localStorage.setItem("data", JSON.stringify(countryData));
  }
  for (const key in countryData) countryCard(countryData[key]);
}

function filterBy() {
  const list = document.querySelector(".list");
  list.classList.toggle("hidden");
  list.addEventListener("click", function (e) {
    if (!e.target.closest(".item")) return;
    const value = e.target;
    filter.setAttribute("data-filter", value.getAttribute("data-filter"));
    if (value.textContent === "All") {
      filter.textContent = "Filter by Region";
    } else filter.textContent = value.textContent;
    list.classList.add("hidden");
    changeRegion();
    searchCountry();
  });
}

function countryCard(data) {
  const card = `<figure id=${data.name
    .toLowerCase()
    .replaceAll(" ", "-")
    .concat("_" + data.id)} class="card ${data.region.toLowerCase()}">
        <img class="img" src="${data.flag.png}"/>
        <div class="info">
        <h2>${data.name}</h2>
        <p>Population: <span>${new Intl.NumberFormat().format(
          data.population
        )}</span></p>
        <p>Region: <span>${data.region}</span></p>
        <p>Capital: <span>${handleUndefined(data.capital)}</span></p>
        </div>
      </figure>`;
  content.insertAdjacentHTML("beforeend", card);
}

function changeRegion() {
  [...content.children].forEach((el) => {
    el.classList.remove("hidden");
    if (
      el.classList.contains("card") &&
      !el.classList.contains(`${filter.getAttribute("data-filter")}`)
    ) {
      el.classList.add("hidden");
    }
  });
}

function searchCountry() {
  [...content.children].forEach((el) => {
    if (!el.classList.contains("hidden") && el.classList.contains("card")) {
      if (
        !el.id
          .slice(0, -4)
          .includes(search.value.toLowerCase().replace(" ", "-"))
      ) {
        el.classList.add("hidden");
      }
    }
  });
}

function countryDetails(data) {
  const country = {
    id: data.cca3,
    name: data.name.common,
    nativeName: getNativeName(data),
    population: data.population,
    region: data.region,
    subregion: data.subregion,
    capital: getCapital(data),
    topLevelDomain: getDomain(data),
    currencies: getCurrencies(data),
    languages: getLanguages(data),
    borders: data?.borders,
    flag: data.flags,
  };
  countryData[data.cca3] = country;
}

function getNativeName(data) {
  if (!data.name?.nativeName) return;
  const keysArr = Object.keys(data.name?.nativeName);
  if (keysArr[0] != "eng") return data.name.nativeName[keysArr[0]].common;
  else if (keysArr[0] == "eng" && keysArr.length > 1)
    return data.name.nativeName[keysArr[1]].common;
  else return data.name.nativeName[keysArr[0]].common;
}

function getLanguages(data) {
  const arr = [];
  for (const key in data.languages) {
    arr.push(data.languages[key]);
  }
  return arr.join(", ");
}

function getCurrencies(data) {
  const arr = [];
  for (const key in data.currencies) {
    arr.push(data.currencies[key].name);
  }
  return arr.join(", ");
}
function getDomain(data) {
  if (!data?.tld) return undefined;
  return data.tld.join(", ");
}
function getCapital(data) {
  if (!data?.capital) return undefined;
  return data.capital.join(", ");
}

// display country details

function displayCountryDetails(data) {
  countryDetailsCard(data);
  main.classList.add("hidden");
}

function goBack() {
  main.classList.remove("hidden");
  document.querySelector(".modal").remove();
}

function countryDetailsCard(data) {
  const header = document.querySelector(".main-header");
  if (document.querySelector(".modal")) {
    document.querySelector(".modal").remove();
  }
  let borders = data?.borders ? displayBorders(data.borders) : "hidden";
  console.log(data);
  const card = `<div class="modal">
      <div class="card-big">
        <button class="btn-back" onclick="goBack()">Back</button>
        <figure class="country-details">
          <img class="flag" src="${handleUndefined(
            data.flag.svg,
            data.flag.png
          )}" alt="" />
          <div class="details">
            <h2>${data.name}</h2>
            <div class="first">
              <p>Native Name:<span>${handleUndefined(
                data.nativeName
              )}</span></p>
              <p>Population:<span>${handleUndefined(data.population)}</span></p>
              <p>Region:<span>${handleUndefined(data.region)}</span></p>
              <p>Sub Region:<span>${handleUndefined(data.subregion)}</span></p>
              <p>Capital:<span>${handleUndefined(data.capital)}</span></p>
            </div>
            <div class="second">
              <p>Top Level Domain:<span>${handleUndefined(
                data.topLevelDomain
              )}</span></p>
              <p>Currencies:<span>${handleUndefined(data.currencies)}</span></p>
              <p>Languages:<span>${handleUndefined(data.languages)}</span></p>
            </div>
            <div class="borders ${borders == "hidden" ? borders : ""}">
              <p>Border Countries:</p>
              ${borders}
            </div>
          </div>
        </figure>
      </div>
    </div>`;
  header.insertAdjacentHTML("afterend", card);
  window.scrollTo(0, 0);
}

function displayBorders(data) {
  if (!data) return;
  let str = "";
  data.forEach((el) => {
    str += `<button class="border" onclick="displayCountryDetails(countryData['${el}'])">${countryData[el].name}</button>`;
  });
  return str;
}

function handleUndefined(data, value = "-") {
  return data ? data : value;
}
