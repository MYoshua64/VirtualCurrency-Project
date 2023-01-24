class Coin {
  public id: string;
  public name: string;
  public symbol: string;
  public imgURL: string;
  public usdPrice: number;
  public eurPrice: number;
  public ilsPrice: number;

  constructor(
    id: string,
    name: string,
    symbol: string,
    imgURL: string,
    usdPrice: number,
    eurPrice: number,
    ilsPrice: number
  ) {
    this.id = id;
    this.name = name;
    this.symbol = symbol;
    this.imgURL = imgURL;
    this.usdPrice = usdPrice;
    this.eurPrice = eurPrice;
    this.ilsPrice = ilsPrice;
  }
}
