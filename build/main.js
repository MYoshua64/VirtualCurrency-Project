"use strict";
$(function () {
    fillCoinList();
    $("#searchForm").on("submit", searchCoin);
    function searchCoin(e) {
        e.preventDefault();
        let searchParams = $("form").serializeArray();
        $.each(searchParams, function (index, field) {
            fetch("https://api.coingecko.com/api/v3/coins/" + field.value.toLowerCase())
                .then((data) => console.log(data.json()))
                .catch((error) => console.log(error));
        });
    }
    function fillCoinList() {
        fetch("https://api.coingecko.com/api/v3/coins")
            .then(function (data) {
            const dataPromise = data.json();
            dataPromise.then(function (dataObj) {
                console.log(dataObj);
                dataObj.forEach(function (value) {
                    const card = createCard(value);
                    $('#coinContainer').append(card);
                });
            })
                .catch((error) => console.log(error));
        })
            .catch((error) => console.log(error));
    }
    function createCard(field) {
        const card = $("<div></div>")
            .addClass("card w-25 p-3")
            .css("display", "inline-block")
            .html(`<div class="card-body">
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
          <div class="card card-body">
            This is a coin
          </div>
        </div>
      </div>`);
        return card;
    }
});
