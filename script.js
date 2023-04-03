"use strict";

const filter = document.querySelector(".btn-filter");
const search = document.getElementById("search");
const content = document.querySelector(".box");
const theme = document.querySelector(".btn-theme");
let countryData = {};

window.addEventListener("load", getData);
theme.addEventListener("click", changeTheme);
filter.addEventListener("click", filterBy);
search.addEventListener("input", searchCountry);

async function getData() {
  if (
    JSON.parse(localStorage.getItem("darkMode")) ||
    (localStorage.getItem("darkMode") === null &&
      matchMedia &&
      matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    document.body.classList.add("dark");
    localStorage.setItem("darkMode", true);
  }
  if (localStorage.getItem("data")) {
    countryData = JSON.parse(localStorage.getItem("data"));
  } else {
    const data = await fetch("https://restcountries.com/v3.1/all");
    const dataJSON = await data.json();
    dataJSON.forEach((el) => countryDetails(el));
    localStorage.setItem("data", JSON.stringify(countryData));
  }
  document.body.classList.remove("hidden");
  for (const key in countryData) countryCard(countryData[key]);
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
function searchCountry() {
  changeRegion();
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
function countryCard(data) {
  const card = `<a href="./details.html?country=${data.id}"id=${data.name
    .toLowerCase()
    .replaceAll(" ", "-")
    .concat("_" + data.id)} class="card ${data.region.toLowerCase()} ${
    (Math.random() >= 0.5 ? 1 : 0) ? "left" : "right"
  }" title="Click for details">
        <img class="img" src="${data.flag.png}" alt=""/>
        <div class="info">
        <h2>${data.name}</h2>
        <p>Population: <span>${new Intl.NumberFormat().format(
          data.population
        )}</span></p>
        <p>Region: <span>${data.region}</span></p>
        <p>Capital: <span>${handleUndefined(data.capital)}</span></p>
        </div>
      </a>`;
  content.insertAdjacentHTML("beforeend", card);
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
