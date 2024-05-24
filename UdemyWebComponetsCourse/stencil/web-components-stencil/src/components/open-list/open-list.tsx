import { Component, Event, EventEmitter, Listen, Method, Prop, Watch, h } from "@stencil/core";

@Component({
  tag: 'uc-open-list',
  styleUrl: './open-list.css',
  shadow: true
})
export class OpenList {
  listElement: HTMLUListElement

  @Prop() optionsList:any[] =[];
  @Prop({mutable: true}) selectedOptions:any[] =[];

  @Prop({reflect: true, mutable: true}) opened: boolean = false;

  @Event({bubbles: true, composed: true}) emitFilterItens: EventEmitter


  // @Listen('click', {target: 'body'})
  // clickedOutside(){
  //   console.log(this.opened)
  //   if(this.opened){
  //     // this.close();
  //   }
    
  // }

  // @Watch('optionsList')
  // changeItems(newValue:any[], oldValue:any[]){
    // console.log('newValue', newValue);
    // console.log('oldValue', oldValue);
    // const itens = Array.from(this.listElement.getElementsByClassName("open-list__item"))
    // console.log(this.listElement.getElementsByClassName("open-list__item"))
    // console.log(itens)
    // itens.forEach(item => {
    //   console.log(item.textContent)
    //   if(newValue.includes(item.textContent)){
    //     item.classList.add('selected')
    //   }else if( item.classList.contains('selected')){
    //     item.classList.remove('selected')
    //   }
    // })
  // }

  componentDidRender(){
    const itens = Array.from(this.listElement.getElementsByClassName("open-list__item"))
    console.log(this.listElement.getElementsByClassName("open-list__item"))
    console.log('componentDidRender', itens)
    itens.forEach(item => {
      console.log(item.textContent)
      if(this.selectedOptions.includes(item.textContent)){
        item.classList.add('selected')
      }else if( item.classList.contains('selected')){
        item.classList.remove('selected')
      }
    })
  }

  connectedCallbback(){
    // this.changeItems(this.optionsList, [])
  }

  componentWillLoad(){
    console.log('component will load', this.selectedOptions)
    // this.changeItems.bind(this, this.optionsList, [])
  }

  @Method()
  open(){
    this.opened = true
  }

  @Method()
  close(){
    this.opened = false;
  }

  selectItem(rowItem: number){
    const item = this.listElement.getElementsByClassName("open-list__item")[rowItem]
    if(this.selectedOptions.includes(item.textContent)){
      this.selectedOptions = this.selectedOptions.filter(option => option != item.textContent)
      item.classList.remove('selected')
    }else{
      this.selectedOptions.push(item.textContent)
      item.classList.add('selected')
    }

    console.log(this.selectedOptions)
  }

  filter(){
    console.log(this.selectedOptions)
    this.emitFilterItens.emit(this.selectedOptions)
    this.close();
  }

  render(){
    return (
      <div class="open-list__container">
         <ul class="open-list__list" ref={el => this.listElement = el}>
          {this.optionsList.map((item, index) => { 
            return <li class="open-list__item" onClick={this.selectItem.bind(this, index)}>
              {item}
            </li>
          })}
          </ul> 
          <button onClick={this.filter.bind(this)} class="open-list__button">Filtrar</button>
      </div>
    )
  }
}