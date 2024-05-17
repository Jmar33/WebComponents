import { Component, State, h, Element, Prop, Watch, Listen } from "@stencil/core";
import { AV_API_KEY } from "../../global/global";

@Component({
  tag: 'uc-stock-price',
  styleUrl: './stock-price.css',
  shadow: true
})
export class StockPrince{
  stockInput: HTMLInputElement
  // initialStockSymbol: string

  @Element() el: HTMLElement //É possível acessar um elemento HTML dentro do nosso componente por meio do decorator Element para referenciar o elemento root

  @State() fetchedPrice: number
  @State() stockUserInput: string
  @State() stockInputValid = false
  @State() error: string
  @State() loading = false
  @Prop({mutable: true, reflect: true}) stockSymbol: string


  onUserInput(event: Event){
    this.stockUserInput = (event.target as HTMLInputElement).value
    if(this.stockUserInput.trim() !== ''){
      this.stockInputValid = true
    }else{
      this.stockInputValid = false
    }
  }

  @Watch('stockSymbol')
  stockSymbolChanged(newValue: string, oldValue:string){
    if(newValue !== oldValue){
      this.stockUserInput = newValue
      this.stockInputValid = true
      this.fetchStockPrice(newValue)
    }

  }

  componentWillLoad(){
    // Esse lifecycle hook é executado quando o componente está prestes a ser carregado na DOM pela primeira vez
    // Aqui já temos acessos as propriedades, mas é esse hook é melhor pra caso precisemos alterar alguma propriedade stateful
    console.log('componentWillLoad')
    console.log(this.stockSymbol)
  }
  
  componentDidLoad(){
    // Esse lifecycle hook é executado logo após o componente ser renderizado na DOM 
    // Caso o valor de uma propriedade stateful seja alterada, o componente seré re-renderizado
    console.log('componentDidLoad')
    if(this.stockSymbol){
      // this.initialStockSymbol = this.stockSymbol
      this.stockUserInput = this.stockSymbol
      this.stockInputValid = true
      this.fetchStockPrice(this.stockSymbol)
    }
  }

  componentWillUpdate(){
    // Esse lifecycle é executado segundos antes do componente ser re-renderizado após alguma alteração propriedade ou estado
    console.log('componentWillUpdate')
  }

  componentDidUpdate(){
    // Esse lifecycle hook é executado logo após o componente ter sido re-renderizado por conta de alguma alteração de propriedade ou estado
    console.log('componentDidUpdate')
    // if(this.stockSymbol !== this.initialStockSymbol){
    //   this.initialStockSymbol = this.stockSymbol
    //   this.fetchStockPrice(this.stockSymbol)
    // }
  }

  disconnectedCallback(){
    // Esse lifecycle hook é executado logo após o componente ter sido removido da DOM
    console.log('disconnectedCallback')    
  }

  onFetchStockPrice(event: Event){
    event.preventDefault();
    // const stockSymbol = (this.el.shadowRoot.querySelector("#stock-symbol") as HTMLInputElement).value 
    const stockSymbol = this.stockInput.value
    this.fetchStockPrice(stockSymbol)
   
  }

  @Listen('ucSymbolSelected', {target: "body"})
  onStockSymbolSelected(event: CustomEvent){
    console.log('stock symbol selected: ' + event.detail)
    if(event.detail && event.detail !== this.stockSymbol){
      this.stockSymbol = event.detail
    }
  }

  fetchStockPrice(stockSymbol: string){
    this.loading = true
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
      this.loading = false
    })
    .catch(err => {
      this.error = err.message
      this.fetchedPrice = null
      this.loading = false
    })
  }

  // Esse método do stencil nos permite acessar alguns metadados do nosso próprio componentes
  hostData(){
    return { class: this.error ? 'error' : ''}
  }

  render(){
    let dataContent = <p>Please enter a symbol!</p>
    if(this.error){
      dataContent = <p>{this.error}</p>
    }
    if(this.fetchedPrice){
      dataContent = <p>Price: ${this.fetchedPrice}</p>
    }
    if(this.loading){
      dataContent = <uc-spinner></uc-spinner>;
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