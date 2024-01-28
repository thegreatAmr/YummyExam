let rowData = document.getElementById("rowData");
let searchContainer = document.getElementById("searchContainer");
let submitBtn;

$(document).ready(() => {
  searchByName("").then(() => {
    $(".loading-screen").fadeOut(500);
    $("body").css("overflow", "visible");
  });
});

function displayMeals(arr) {
  const box = arr
    .map(
      (meal) => `
    <div class="col-md-3">
      <div onclick="getMealDetails('${meal.idMeal}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
        <img class="w-100" src="${meal.strMealThumb}" alt="" srcset="">
        <div class="meal-layer position-absolute d-flex align-items-center text-black p-2">
          <h3>${meal.strMeal}</h3>
        </div>
      </div>
    </div>
  `
    )
    .join("");

  rowData.innerHTML = box;
}

async function getCategories() {
  try {
    rowData.innerHTML = "";
    $(".inner-loading-screen").fadeIn(300);
    searchContainer.innerHTML = "";

    let response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/categories.php`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch categories. Status: ${response.status}`);
    }

    response = await response.json();

    displayCategories(response.categories);
  } catch (error) {
    console.error(error.message);
  } finally {
    $(".inner-loading-screen").fadeOut(300);
  }
}

function displayCategories(arr) {
  let box = "";

  for (let i = 0; i < arr.length; i++) {
    box += `
      <div class="col-md-3">
        <div onclick="getCategoryMeals('${
          arr[i].strCategory
        }')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
          <img class="w-100" src="${arr[i].strCategoryThumb}" alt="" srcset="">
          <div class="meal-layer position-absolute text-center text-black p-2">
            <h3>${arr[i].strCategory}</h3>
            <p>${arr[i].strCategoryDescription
              .split(" ")
              .slice(0, 20)
              .join(" ")}</p>
          </div>
        </div>
      </div>
    `;
  }

  rowData.innerHTML = box;
}

async function getArea() {
  try {
    rowData.innerHTML = "";
    searchContainer.innerHTML = "";

    $(".inner-loading-screen").fadeIn(300);

    // Fetch list of areas
    const response = await fetch(
      "https://www.themealdb.com/api/json/v1/1/list.php?a=list"
    );
    const data = await response.json();

    console.log(data.meals);

    displayArea(data.meals);

    $(".inner-loading-screen").fadeOut(300);
  } catch (error) {
    console.error("Error fetching areas:", error);

    $(".inner-loading-screen").fadeOut(300);
  }
}

function displayArea(arr) {
  let box = "";

  for (let i = 0; i < arr.length; i++) {
    box += `
      <div class="col-md-3">
        <div onclick="getAreaMeals('${arr[i].strArea}')" class="rounded-2 text-center cursor-pointer">
          <i class="fa-solid fa-house-laptop fa-4x"></i>
          <h3>${arr[i].strArea}</h3>
        </div>
      </div>
    `;
  }

  rowData.innerHTML = box;
}

async function getIngredients() {
  rowData.innerHTML = "";
  $(".inner-loading-screen").fadeIn(300);

  searchContainer.innerHTML = "";

  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?i=list`
  );
  const data = await response.json();
  console.log(data.meals);

  displayIngredients(data.meals.slice(0, 20));
  $(".inner-loading-screen").fadeOut(300);
}

function displayIngredients(arr) {
  let box = arr
    .map(
      (ingredient) => `
    <div class="col-md-3">
      <div onclick="getIngredientsMeals('${
        ingredient.strIngredient
      }')" class="rounded-2 text-center cursor-pointer">
        <i class="fa-solid fa-drumstick-bite fa-4x"></i>
        <h3>${ingredient.strIngredient}</h3>
        <p>${ingredient.strDescription.split(" ").slice(0, 20).join(" ")}</p>
      </div>
    </div>`
    )
    .join("");

  rowData.innerHTML = box;
}

async function getCategoryMeals(category) {
  rowData.innerHTML = "";
  $(".inner-loading-screen").fadeIn(300);

  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
  );
  response = await response.json();

  displayMeals(response.meals.slice(0, 20));

  $(".inner-loading-screen").fadeOut(300);
}

async function getAreaMeals(area) {
  rowData.innerHTML = "";
  $(".inner-loading-screen").fadeIn(300);

  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`
  );
  response = await response.json();

  displayMeals(response.meals.slice(0, 20));

  $(".inner-loading-screen").fadeOut(300);
}

async function getIngredientsMeals(ingredients) {
  rowData.innerHTML = "";
  $(".inner-loading-screen").fadeIn(300);

  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredients}`
  );
  response = await response.json();

  displayMeals(response.meals.slice(0, 20));

  $(".inner-loading-screen").fadeOut(300);
}

async function getMealDetails(mealID) {
  closeSideNav();
  rowData.innerHTML = "";
  $(".inner-loading-screen").fadeIn(300);

  searchContainer.innerHTML = "";

  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`
  );
  response = await response.json();

  displayMealDetails(response.meals[0]);

  $(".inner-loading-screen").fadeOut(300);
}

function displayMealDetails(meal) {
  searchContainer.innerHTML = "";

  let ingredients = "";
  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients += `<li class="alert alert-info m-2 p-1">${
        meal[`strMeasure${i}`]
      } ${meal[`strIngredient${i}`]}</li>`;
    }
  }

  let tags = meal.strTags?.split(",") || [];
  let tagsStr = tags
    .map((tag) => `<li class="alert alert-danger m-2 p-1">${tag}</li>`)
    .join("");

  let box = `
    <div class="col-md-4">
      <img class="w-100 rounded-3" src="${meal.strMealThumb}" alt="">
      <h2>${meal.strMeal}</h2>
    </div>
    <div class="col-md-8">
      <h2>Instructions</h2>
      <p>${meal.strInstructions}</p>
      <h3><span class="fw-bolder">Area : </span>${meal.strArea}</h3>
      <h3><span class="fw-bolder">Category : </span>${meal.strCategory}</h3>
      <h3>Recipes :</h3>
      <ul class="list-unstyled d-flex g-3 flex-wrap">
        ${ingredients}
      </ul>
      <h3>Tags :</h3>
      <ul class="list-unstyled d-flex g-3 flex-wrap">
        ${tagsStr}
      </ul>
      <a target="_blank" href="${meal.strSource}" class="btn btn-success">Source</a>
      <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger">Youtube</a>
    </div>`;

  rowData.innerHTML = box;
}

function showSearchInputs() {
  searchContainer.innerHTML = `
    <div class="row py-4">
      <div class="col-md-6">
        <input onkeyup="searchByName(this.value)" class="form-control bg-transparent text-white" type="text" placeholder="Search By Name">
      </div>
      <div class="col-md-6">
        <input onkeyup="searchByFLetter(this.value)" maxlength="1" class="form-control bg-transparent text-white" type="text" placeholder="Search By First Letter">
      </div>
    </div>`;

  rowData.innerHTML = "";
}

async function searchByName(term) {
  closeSideNav();
  rowData.innerHTML = "";
  $(".inner-loading-screen").fadeIn(300);

  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`
  );
  response = await response.json();

  if (response.meals) {
    displayMeals(response.meals);
  } else {
    displayMeals([]);
  }

  $(".inner-loading-screen").fadeOut(300);
}

async function searchByFLetter(term) {
  closeSideNav();
  rowData.innerHTML = "";
  $(".inner-loading-screen").fadeIn(300);

  term = term || "a"; // Using the logical OR operator to set default value if term is an empty string

  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?f=${term}`
  );
  response = await response.json();

  if (response.meals) {
    displayMeals(response.meals);
  } else {
    displayMeals([]);
  }

  $(".inner-loading-screen").fadeOut(300);
}

function showContacts() {
  rowData.innerHTML = `<div class="contact min-vh-100 d-flex justify-content-center align-items-center">
    <div class="container w-75 text-center">
        <div class="row g-4">
            <div class="col-md-6">
                <input id="nameInput" onkeyup="inputsValidation()" type="text" class="form-control" placeholder="Enter Your Name">
                <div id="nameAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Special characters and numbers not allowed
                </div>
            </div>
            <div class="col-md-6">
                <input id="emailInput" onkeyup="inputsValidation()" type="email" class="form-control " placeholder="Enter Your Email">
                <div id="emailAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Email not valid *exemple@yyy.zzz
                </div>
            </div>
            <div class="col-md-6">
                <input id="phoneInput" onkeyup="inputsValidation()" type="text" class="form-control " placeholder="Enter Your Phone">
                <div id="phoneAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid Phone Number
                </div>
            </div>
            <div class="col-md-6">
                <input id="ageInput" onkeyup="inputsValidation()" type="number" class="form-control " placeholder="Enter Your Age">
                <div id="ageAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid age
                </div>
            </div>
            <div class="col-md-6">
                <input  id="passwordInput" onkeyup="inputsValidation()" type="password" class="form-control " placeholder="Enter Your Password">
                <div id="passwordAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid password *Minimum eight characters, at least one letter and one number:*
                </div>
            </div>
            <div class="col-md-6">
                <input  id="repasswordInput" onkeyup="inputsValidation()" type="password" class="form-control " placeholder="Repassword">
                <div id="repasswordAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Passwords do not match 
                </div>
            </div>
        </div>
        <button id="submitBtn" disabled class="btn btn-outline-danger px-2 mt-3">Submit</button>
    </div>
</div> `;
  submitBtn = document.getElementById("submitBtn");

  const addFocusListener = (inputId) => {
    document.getElementById(inputId).addEventListener("focus", () => {
      window[inputId + "Touched"] = true;
    });
  };

  addFocusListener("nameInput");
  addFocusListener("emailInput");
  addFocusListener("phoneInput");
  addFocusListener("ageInput");
  addFocusListener("passwordInput");
  addFocusListener("repasswordInput");
}

function inputsValidation() {
  validateAndToggleAlert(
    nameInputTouched,
    "nameInput",
    "nameAlert",
    nameValidation
  );
  validateAndToggleAlert(
    emailInputTouched,
    "emailInput",
    "emailAlert",
    emailValidation
  );
  validateAndToggleAlert(
    phoneInputTouched,
    "phoneInput",
    "phoneAlert",
    phoneValidation
  );
  validateAndToggleAlert(
    ageInputTouched,
    "ageInput",
    "ageAlert",
    ageValidation
  );
  validateAndToggleAlert(
    passwordInputTouched,
    "passwordInput",
    "passwordAlert",
    passwordValidation
  );
  validateAndToggleAlert(
    repasswordInputTouched,
    "repasswordInput",
    "repasswordAlert",
    repasswordValidation
  );

  const isAllValid =
    nameValidation() &&
    emailValidation() &&
    phoneValidation() &&
    ageValidation() &&
    passwordValidation() &&
    repasswordValidation();

  isAllValid
    ? submitBtn.removeAttribute("disabled")
    : submitBtn.setAttribute("disabled", true);
}

function validateAndToggleAlert(
  inputTouched,
  inputId,
  alertId,
  validationFunction
) {
  if (inputTouched) {
    const inputElement = $(`#${inputId}`);
    const alertElement = $(`#${alertId}`);

    if (validationFunction()) {
      alertElement.removeClass("d-block").addClass("d-none");
    } else {
      alertElement.removeClass("d-none").addClass("d-block");
    }
  }
}

function nameValidation() {
  const nameInputValue = $("#nameInput").val();
  const nameRegex = /^[a-zA-Z ]+$/;

  return nameRegex.test(nameInputValue);
}

function emailValidation() {
  const emailInputValue = $("#emailInput").val();
  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return emailRegex.test(emailInputValue);
}

function phoneValidation() {
  const phoneInputValue = $("#phoneInput").val();
  const phoneRegex =
    /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;

  return phoneRegex.test(phoneInputValue);
}

function ageValidation() {
  const ageInputValue = $("#ageInput").val();
  const ageRegex = /^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/;

  return ageRegex.test(ageInputValue);
}

function passwordValidation() {
  const passwordInputValue = $("#passwordInput").val();
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/;

  return passwordRegex.test(passwordInputValue);
}

function repasswordValidation() {
  const repasswordInput = $("#repasswordInput").val();
  const passwordInput = $("#passwordInput").val();

  return repasswordInput === passwordInput;
}

function openSideNav() {
  const sideNavMenu = $(".side-nav-menu");
  const openCloseIcon = $(".open-close-icon");
  const links = $(".links li");

  sideNavMenu.animate({ left: 0 }, 500);

  openCloseIcon.removeClass("fa-align-justify").addClass("fa-x");

  links.each((index, element) => {
    $(element).animate({ top: 0 }, (index + 5) * 100);
  });
}

function closeSideNav() {
  const sideNavMenu = $(".side-nav-menu");
  const openCloseIcon = $(".open-close-icon");
  const links = $(".links li");

  const boxWidth = sideNavMenu.find(".nav-tab").outerWidth();

  sideNavMenu.animate({ left: -boxWidth }, 500);

  openCloseIcon.addClass("fa-align-justify").removeClass("fa-x");

  links.animate({ top: 300 }, 500);
}

const sideNavMenu = $(".side-nav-menu");
const openCloseIcon = $(".side-nav-menu i.open-close-icon");

function toggleSideNav() {
  if (sideNavMenu.css("left") === "0px") {
    closeSideNav();
  } else {
    openSideNav();
  }
}

closeSideNav();
openCloseIcon.click(toggleSideNav);
