import { Component, Prop, h } from "@stencil/core";

@Component({
  tag: 'uc-open-list',
  styleUrl: './open-list.css',
  shadow: true
})
export class OpenList {
  @Prop() optionsList:any[];
  @Prop() selectedOptions:any[];

  render(){
    return (
      <div class="open-list__container">
         <ul class="open-list__list">
          {this.optionsList.map(item => { 
            return <li class="open-list__item">
              {item}
            </li>
          })}
          </ul> 
      </div>
    )
  }
}