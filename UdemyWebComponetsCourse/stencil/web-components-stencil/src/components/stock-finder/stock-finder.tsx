import { Component, State, h, Event, EventEmitter } from "@stencil/core";
import { AV_API_KEY } from "../../global/global";

@Component({
  tag: 'uc-stock-finder',
  styleUrl: './stock-finder.css',
  shadow: true
})
export class StockFinder {
  stockNameInput: HTMLInputElement

  @State() searchResults: {name: string, symbol: string}[] = []
  @State() lodiang = false;
  @Event({bubbles: true, composed: true}) ucSymbolSelected: EventEmitter<string>

  
  onFindStocks(event: Event){
    this.lodiang = true
    event.preventDefault()
    const stockName = this.stockNameInput.value
    fetch(`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${stockName}&apikey=${AV_API_KEY}`)
      .then(res => res.json())
      .then(parsedRes => {
        console.log(parsedRes)
        this.searchResults = parsedRes['bestMatches'].map(match => {
          return {name: match['01. name'], symbol: match['02. symbol']}
        })
        this.lodiang= false
      })
      .catch(err => {
        this.lodiang = false
        console.log(err)
      })
  }

  onSelecteSymbol(symbol: string){
    this.ucSymbolSelected.emit(symbol)
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
        {this.searchResults.map(result => (
          <li onClick={this.onSelecteSymbol.bind(this, result.symbol)}>
            <strong>result.symbol</strong> - {result.name}
          </li>))}
      </ul>
    ]
  }
}