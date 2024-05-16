import { Component, Method, Prop, State, h } from "@stencil/core";


@Component({
  tag: 'uc-tooltip',
  styleUrl: './tooltip.css',
  shadow: true
})
export class Tooltip {
  @Prop() text:string 
  @State() tooltipIsVisible: boolean = false;

  onToggleTooltip(){
   this.tooltipIsVisible = !this.tooltipIsVisible
  }

  render(){
    let tooltip = null;
    if(this.tooltipIsVisible){
      tooltip =  <div class="tooltip-text">{this.text}</div>
    }
    return [
      <slot></slot>,
      <span class="tooltip-icon" onClick={this.onToggleTooltip.bind(this)}>?</span> , 
      tooltip
    ]
  }
  

}