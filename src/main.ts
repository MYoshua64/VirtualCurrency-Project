$(function () {
  fillCoinList();
  $("#searchForm").on("submit", searchCoin);

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
        </h5>
        <p class="card-text">${field.name}</p>
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
        $(`#${value.id}-desc`).text(getCoinDescription(value.id));
        $("#coinContainer").append(card);
      });
    });
  }

  function getCoinDescription(coinID:string):string{
    fetch("https://api.coingecko.com/api/v3/coins/" + coinID)
    .then((data) => {
      const dataPromise = data.json();
      dataPromise.then((dataObj) => {
        console.log(coinID);
        return dataObj.description.en;
      })
      .catch((error) => {
        console.log(error);
      });
    })
    return `Coin with id of ${coinID} did not return a value!`;
  }
});
