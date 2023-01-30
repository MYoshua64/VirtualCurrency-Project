"use strict";
$(function () {
    fillCoinList();
    $("#searchForm").on("submit", searchCoin);
    $("#save-btn").on("click", function () {
        $("#coinModal").modal("toggle");
    });
    let chosenCoins = [];
    let allCoins = [];
    function searchCoin(e) {
        e.preventDefault();
        let searchParams = $("form").serializeArray();
        $.each(searchParams, function (index, field) {
            const selected = allCoins.find((c) => {
                return c["id"] === field.value.toLocaleLowerCase();
            });
            if (selected != undefined) {
                displaySingularCoin(selected);
            }
        });
        function displaySingularCoin(selected) {
            const coinCard = $(`#${selected.id}-card`);
            console.log(coinCard);
            $('#coinContainer').html(``).append(coinCard);
        }
    }
    function fillCoinList() {
        fetch("https://api.coingecko.com/api/v3/coins")
            .then((data) => resolveCoinListAPI(data))
            .catch((error) => console.log(error));
    }
    function createCard(field) {
        const card = $("<div></div>")
            .attr('id', `${field.id}-card`)
            .addClass("card w-25 p-3")
            .css("display", "inline-block")
            .html(`<div class="card-body">
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
            <p>USD Price: ${field.market_data.current_price.usd}$</p>
            <p>EUR Price: ${field.market_data.current_price.eur}&#8364;</p>
            <p>ILS Price: ${field.market_data.current_price.ils}&#8362;</p>
          </div>
        </div>
      </div>`);
        return card;
    }
    function resolveCoinListAPI(data) {
        const dataPromise = data.json();
        dataPromise.then(function (dataObj) {
            $("#coinContainer").html(``);
            console.log(dataObj);
            dataObj.forEach(function (value) {
                const card = createCard(value);
                const coin = new Coin(value.id, value.name, value.symbol, value.image.thumb, value.market_data.current_price.usd, value.market_data.current_price.eur, value.market_data.current_price.ils);
                allCoins.push(coin);
                $("#coinContainer").append(card);
            });
            console.log(allCoins);
            $(".coin-toggle").one("click", function () {
                handleToggleOn($(this));
            });
        });
    }
    function getCoinDescription(coinID) {
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
    function handleToggleOn(element, shouldShorten = false) {
        if (chosenCoins.length == 5) {
            //pop out the modal
            showModal();
            element.prop("checked", false).one("click", function () {
                handleToggleOn(element);
            });
        }
        else {
            let coinID = element.attr("id");
            if (coinID != undefined) {
                if (shouldShorten) {
                    coinID = coinID.slice(0, -7);
                }
                chosenCoins.push(coinID);
                $(`#${coinID}`).prop("checked", true);
                element.one("click", function () {
                    handleToggleOff(element, shouldShorten);
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
            if (displayCoin != undefined) {
                $(".modal-body").append(createCoinDisplay(displayCoin));
            }
        });
        $(".coin-toggle-chosen")
            .prop("checked", true)
            .one("click", function () {
            handleToggleOff($(this), true);
        });
        $("#coinModal").modal("toggle");
        function createCoinDisplay(coin) {
            const card = $("<div></div>")
                .addClass("card w-50 p-3")
                .css("display", "inline-block").html(`
        <img src="${coin.imgURL}" alt="...">
        <div class="card-body">
          <p class="card-text">${coin.name}
            <span>
              <div class="form-check form-switch">
               <input class="form-check-input coin-toggle-chosen" type="checkbox" role="switch" id="${coin.id}-toggle-chosen">
              </div>
            </span>
          </p>
        </div>
      `);
            return card;
        }
    }
    function handleToggleOff(element, shouldShorten = false) {
        let coinID = element.attr("id");
        if (coinID != undefined) {
            if (shouldShorten) {
                coinID = coinID.slice(0, -7);
                console.log(coinID);
            }
            const coinIndex = chosenCoins.indexOf(coinID);
            console.log(coinIndex);
            if (coinIndex >= 0) {
                chosenCoins.splice(coinIndex, 1);
            }
            if (shouldShorten) {
                element.prop("checked", false).one("click", function () {
                    handleToggleOn(element, shouldShorten);
                });
            }
            else {
                $(`#${coinID}`).prop("checked", false).one("click", function () {
                    handleToggleOn(element, shouldShorten);
                });
            }
            console.log(chosenCoins);
        }
    }
});
