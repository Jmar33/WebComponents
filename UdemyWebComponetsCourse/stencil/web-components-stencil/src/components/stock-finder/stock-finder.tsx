import { Component, State, h } from "@stencil/core";
import { AV_API_KEY } from "../../global/global";

@Component({
  tag: 'uc-stock-finder',
  styleUrl: './stock-finder.css',
  shadow: true
})
export class StockFinder {
  stockNameInput: HTMLInputElement

  @State() searchResults: {name: string, symbol: string}[] = []

  onFindStocks(event: Event){
    event.preventDefault()
    const stockName = this.stockNameInput.value
    fetch(`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${stockName}&apikey=${AV_API_KEY}`)
      .then(res => res.json())
      .then(parsedRes => {
        console.log(parsedRes)
        this.searchResults = parsedRes['bestMatches'].map(match => {
          return {name: match['01. name'], symbol: match['02. symbol']}
        })
      })
      .catch(err => {
        console.log(err)
      })
  }

  render(){
    return [     
      <form onSubmit={this.onFindStocks.bind(this)}>
        <input id="stock-symbol" 
          ref={el => this.stockNameInput = el}
        />
        <button type="submit" >Fetch!</button>
      </form>,
      <ul>
        {this.searchResults.map(result => <li>{result.name}</li>)}
      </ul>
    ]
  }
}