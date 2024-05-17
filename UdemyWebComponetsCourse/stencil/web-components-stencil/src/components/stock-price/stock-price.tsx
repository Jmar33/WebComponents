import { Component, State, h, Element, Prop } from "@stencil/core";
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
  @State() stockUserInput: string
  @State() stockInputValid = false
  @State() error: string
  @Prop() stockSymbol: string

  onUserInput(event: Event){
    this.stockUserInput = (event.target as HTMLInputElement).value
    if(this.stockUserInput.trim() !== ''){
      this.stockInputValid = true
    }else{
      this.stockInputValid = false
    }
  }

  componentDidLoad(){
    if(this.stockSymbol){
      this.fetchStockPrice(this.stockSymbol)
    }
  }

  onFetchStockPrice(event: Event){
    event.preventDefault();
    // const stockSymbol = (this.el.shadowRoot.querySelector("#stock-symbol") as HTMLInputElement).value 
    const stockSymbol = this.stockInput.value
    this.fetchStockPrice(stockSymbol)
   
  }

  fetchStockPrice(stockSymbol: string){
    fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stockSymbol}&apikey=${AV_API_KEY}`)
    .then(res => {
      if(res.status !== 200){
        throw new Error('Invalid!')
      }
      return res.json()
    })
    .then(parsedRes => {
      if(!parsedRes['Global Quote']['05. price']){
        throw new Error('Invalid Symbol!')
      }
      this.error = null
      this.fetchedPrice = + parsedRes['Global Quote']['05. price']
    })
    .catch(err => {
      this.error = err.message
    })
  }

  render(){
    let dataContent = <p>Please enter a symbol!</p>
    if(this.error){
      dataContent = <p>{this.error}</p>
    }
    if(this.fetchedPrice){
      dataContent = <p>Price: ${this.fetchedPrice}</p>
    }
    return [
      <form onSubmit={this.onFetchStockPrice.bind(this)}>
        {/* Outra forma de acessar um elemento da DOM do nosso componente é criando uma referência */}
        <input id="stock-symbol" 
          ref={el => this.stockInput = el}
          value={this.stockUserInput}
          onInput={this.onUserInput.bind(this)}
        />
        <button type="submit" disabled={!this.stockInputValid}>Fetch</button>
      </form>,
      <div>
        {dataContent}
      </div>
    ]
  }
}