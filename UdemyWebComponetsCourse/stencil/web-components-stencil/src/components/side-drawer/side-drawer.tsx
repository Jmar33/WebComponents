import { Component, Prop } from "@stencil/core/";
import { h } from "@stencil/core";


@Component({
  tag: "uc-side-drawer",
  styleUrl: "./side-drawer.css",
  shadow: true
})
export class SideDrawer {
  @Prop({reflect: true}) title: string = "Side Drawer"

  render() {
    return (
    <aside>
      <header><h1>{this.title}</h1></header>
      <menu>
        <slot/>
      </menu> 
    </aside> 
  )
  }
}