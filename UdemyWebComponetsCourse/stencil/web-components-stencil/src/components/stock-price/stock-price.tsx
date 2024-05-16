import { Component, State, h, Element } from "@stencil/core";
import { AV_API_KEY } from "../../global/global";

@Component({
  tag: 'uc-stock-price',
  styleUrl: './stock-price.css',
  shadow: true
})
export class StockPrince{
  stockInput: HTMLInputElement

  @Element() el: HTMLElement //É possível acessar um elemento HTML dentro do nosso componente por meio do decorator Element para referenciar o elemento root

  @State() fetchedPrice: number

  onFetchStockPrice(event: Event){
    event.preventDefault();
    // const stockSymbol = (this.el.shadowRoot.querySelector("#stock-symbol") as HTMLInputElement).value 
    const stockSymbol = this.stockInput.value
    fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stockSymbol}&apikey=${AV_API_KEY}`)
      .then(res => {
        return res.json()
      })
      .then(parsedRes => {
        console.log(parsedRes)
        this.fetchedPrice = + parsedRes['Global Quote']['05. price']
      })
      .catch(err => {
        console.log(err)
      })
}

  render(){
    return [
      <form onSubmit={this.onFetchStockPrice.bind(this)}>
        {/* Outra forma de acessar um elemento da DOM do nosso componente é criando uma referência */}
        <input id="stock-symbol" ref={el => this.stockInput = el}/>
        <button type="submit">Fetch</button>
      </form>,
      <div>
        <p>Price: ${this.fetchedPrice}</p>
      </div>
    ]
  }
}