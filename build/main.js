"use strict";
$(function () {
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
});
