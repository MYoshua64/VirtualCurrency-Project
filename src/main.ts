$(function () {
  fillCoinList();
  $("#searchForm").on("submit", searchCoin);
  let chosenCoins: string[] = [];
  let allCoins: Coin[] = [];

  function searchCoin(e: any): void {
    e.preventDefault();
    let searchParams = $("form").serializeArray();

    $.each(searchParams, function (index, field) {
      fetch(
        "https://api.coingecko.com/api/v3/coins/" + field.value.toLowerCase()
      )
        .then((data) => console.log(data.json()))
        .catch((error) => console.log(error));
    });
  }

  function fillCoinList(): void {
    fetch("https://api.coingecko.com/api/v3/coins")
      .then((data) => resolveCoinListAPI(data))
      .catch((error) => console.log(error));
  }

  function createCard(field: any): JQuery<HTMLElement> {
    const card = $("<div></div>")
      .addClass("card w-25 p-3")
      .css("display", "inline-block")
      .html(
        `<div class="card-body">
        <h5 class="card-title">
          ${field.symbol}<span class="ms-5"
            ><img
              src=${field.image.small}
              alt=""
          /></span>
          <span>
            <div class="form-check form-switch">
              <input class="form-check-input coin-toggle" type="checkbox" role="switch" id="${field.id}-toggle">
            </div>
          </span>
        </h5>
        <p class="card-text">
        ${field.name}
        </p>
        <a
          class="btn btn-primary"
          data-bs-toggle="collapse"
          href="#${field.symbol}"
          role="button"
          aria-expanded="false"
          aria-controls="collapseExample"
        >
          More Info
        </a>
        <div class="collapse" id="${field.symbol}">
          <div class="card card-body" id="${field.id}-desc">
            This is a coin
          </div>
        </div>
      </div>`
      );
    return card;
  }

  function resolveCoinListAPI(data: Response) {
    const dataPromise = data.json();
    dataPromise.then(function (dataObj) {
      dataObj.forEach(function (value: any) {
        const card = createCard(value);

        const coin = new Coin(
          value.id,
          value.name,
          value.symbol,
          value.image.thumb
        );
        allCoins.push(coin);

        $("#coinContainer").append(card);
      });
      $(".coin-toggle").one("click", function () {
        handleToggleOn($(this));
      });
    });
  }

  function getCoinDescription(coinID: string): string {
    fetch("https://api.coingecko.com/api/v3/coins/" + coinID).then((data) => {
      const dataPromise = data.json();
      dataPromise
        .then((dataObj) => {
          console.log(coinID);
          return dataObj.description.en;
        })
        .catch((error) => {
          console.log(error);
        });
    });
    return `Coin with id of ${coinID} did not return a value!`;
  }
  function handleToggleOn(element: JQuery<HTMLElement>) {
    if (chosenCoins.length == 5) {
      //pop out the modal
      showModal();
      element.prop("checked", false).one("click", function () {
        handleToggleOn(element);
      });
    } else {
      const coinID = element.attr("id");

      if (coinID != undefined) {
        chosenCoins.push(coinID);
        element.one("click", function () {
          handleToggleOff(element);
        });
        console.log(chosenCoins);
      }
    }
  }

  function showModal() {
    $(".modal-body").html(``);
    console.log(chosenCoins);
    $.each(chosenCoins, function (index, coin) {
      const coinName = coin.slice(0, -7);
      const displayCoin = allCoins.find((c) => {
        return c["id"] === coinName;
      });
      $(".modal-body").append(createCoinDisplay(displayCoin));
    });
    $("#coinModal").modal("toggle");

    function createCoinDisplay(coin: Coin): string {
      return `
      <div class="card" style="width: 80%;">
        <img src="${coin.imgURL}" alt="...">
          <div class="card-body">
            <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
          </div>
      </div>
      `;
    }
  }

  function handleToggleOff(element: JQuery<HTMLElement>) {
    const coinID = element.attr("id");

    if (coinID != undefined) {
      const coinIndex = chosenCoins.indexOf(coinID);
      chosenCoins.splice(coinIndex, 1);
      element.one("click", function () {
        handleToggleOn(element);
      });
      console.log(chosenCoins);
    }
  }
});
