/**
 * Loops through the users and renders a ul with li elements for each user
 * @param {*} users
 * @param {*} stocks
 */
function generateUserList(users, stocks) {
  const userList = document.querySelector(".user-list");
  userList.innerHTML = "";
  users.forEach(({ user, id }) => {
    const listItem = document.createElement("li");
    listItem.innerText = `${user.lastname}, ${user.firstname}`;
    listItem.setAttribute("id", id);
    userList.appendChild(listItem);
  });
  userList.addEventListener("click", (event) =>
    handleUserListClick(event, users, stocks),
  );
}

/**
 * Handles the click event on the user list
 * @param {*} event
 * @param {*} users
 * @param {*} stocks
 */
function handleUserListClick(event, users, stocks) {
  // get the user id from the list item
  const userId = event.target.id;
  // find the user in the userData array
  // we use a "truthy" comparison here because the user id is a number and the event target id is a string
  const user = users.find((user) => user.id == userId);
  // populate the form with the user's data
  populateForm(user);
  // render the portfolio items for the user
  renderPortfolio(user, stocks);
}

/**
 * Populates the form with the user's data
 * @param {*} user
 */
function populateForm(user) {
  const fields = [
    { id: "userID", value: user.id },
    { id: "firstname", value: user.user.firstname },
    { id: "lastname", value: user.user.lastname },
    { id: "address", value: user.user.address },
    { id: "city", value: user.user.city },
    { id: "email", value: user.user.email },
  ];

  fields.forEach((field) => {
    document.querySelector(`#${field.id}`).value = field.value;
  });
}

/**
 * Renders the portfolio items for the user
 * @param {*} user
 * @param {*} stocks
 */
function renderPortfolio(user, stocks) {
  // get the user's stock data
  const { portfolio } = user;
  // get the portfolio list element
  const portfolioDetails = document.querySelector(".portfolio-list");
  // clear the list from previous render
  portfolioDetails.innerHTML = "";
  // map over portfolio items and render them
  portfolio.map(({ symbol, owned }) => {
    // create a list item and append it to the list
    const symbolEl = document.createElement("p");
    const sharesEl = document.createElement("p");
    const actionEl = document.createElement("button");
    symbolEl.innerText = symbol;
    sharesEl.innerText = owned;
    actionEl.innerText = "View";
    actionEl.setAttribute("id", symbol);
    portfolioDetails.appendChild(symbolEl);
    portfolioDetails.appendChild(sharesEl);
    portfolioDetails.appendChild(actionEl);
  });

  // register the event listener on the list
  portfolioDetails.addEventListener("click", (event) => {
    // let's make sure we only handle clicks on the buttons
    if (event.target.tagName === "BUTTON") {
      viewStock(event.target.id, stocks);
    }
  });
}

/**
 * Renders the stock information for the symbol
 * @param {*} symbol
 * @param {*} stocks
 */
function viewStock(symbol, stocks) {
  // begin by hiding the stock area until a stock is viewed
  const stockArea = document.querySelector(".stock-form");
  if (stockArea) {
    // find the stock object for this symbol
    const stock = stocks.find(function (s) {
      return s.symbol == symbol;
    });
    document.querySelector("#stockName").textContent = stock.name;
    document.querySelector("#stockSector").textContent = stock.sector;
    document.querySelector("#stockIndustry").textContent = stock.subIndustry;
    document.querySelector("#stockAddress").textContent = stock.address;
    document.querySelector("#logo").src = `logos/${symbol}.svg`;

    const img = document.querySelector("#logo");
    img.onerror = function () {
      //Adding alternative Image if any issues with the actual logo
      img.src = " https://commons.wikimedia.org/wiki/File:Solid_white.svg";
    };
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Parse the JSON strings into JavaScript objects
  const stocksData = JSON.parse(stockContent);
  const userData = JSON.parse(userContent);

  // Generate the user list
  generateUserList(userData, stocksData);

  // Register the event listener on the delete button
  const deleteButton = document.querySelector("#btnDelete"); // Make sure this selector is correct
  if (deleteButton) {
    deleteButton.addEventListener("click", (event) => {
      event.preventDefault();
      const userId = document.querySelector("#userID").value;
      const userIndex = userData.findIndex((user) => user.id == userId);
      if (userIndex !== -1) {
        userData.splice(userIndex, 1);
        generateUserList(userData, stocksData);
      }
    });
  }

  // Register the event listener on the save button
  const saveButton = document.querySelector("#btnSave"); // Make sure this selector is correct
  if (saveButton) {
    saveButton.addEventListener("click", (event) => {
      event.preventDefault();
      const id = document.querySelector("#userID").value;
      const userIndex = userData.findIndex((user) => user.id == id);
      if (userIndex !== -1) {
        userData[userIndex].user = {
          firstname: document.querySelector("#firstname").value,
          lastname: document.querySelector("#lastname").value,
          address: document.querySelector("#address").value,
          city: document.querySelector("#city").value,
          email: document.querySelector("#email").value,
        };
        generateUserList(userData, stocksData);
      }
    });
  }
});
/* add your code here */

