$(function(){
    $('#searchForm').on('submit', searchCoin);

    function  searchCoin(e:any):void{
        // console.log(e.target);
        const searchData:FormData = new FormData();
        console.log($('input').text())
        // searchData.append("coin", $('input').contents)
    }
})