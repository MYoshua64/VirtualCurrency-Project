"use strict";
$(function () {
    $('#searchForm').on('submit', searchCoin);
    function searchCoin(e) {
        // console.log(e.target);
        const searchData = new FormData();
        console.log($('input').text());
        // searchData.append("coin", $('input').contents)
    }
});
