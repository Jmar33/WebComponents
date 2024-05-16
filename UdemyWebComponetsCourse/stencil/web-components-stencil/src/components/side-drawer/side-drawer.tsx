import { Component, Prop, State } from "@stencil/core/";
import { h } from "@stencil/core";


@Component({
  tag: "uc-side-drawer",
  styleUrl: "./side-drawer.css",
  shadow: true
})
export class SideDrawer {
  @Prop({reflect: true}) title: string = "Side Drawer"
  @Prop({reflect: true, mutable: true}) open: boolean // Por padrão as propriedades só podem receber o valor vindo do template HTML elas são unidirecionais
                                                      // para alterar esse comportamento devemos trocar o valor do mutable para true

  @State() showContactInfo: boolean //O decorator Sate é usado quando queremos monitorar uma propriedade que terá seus valores alterados internamente, dentro do
                                    //próprio componente

  onCloseDrawer(){
    console.log('Closing...')
    this.open = false;
  }

  onContentChange(content: string){
    this.showContactInfo = content === 'contact'
  }

  render() {
    let mainContent = <slot/>
    if(this.showContactInfo){
      mainContent= (
        <div id="contact-information">
          <h2>Contact Information</h2>
          <p>You can reach us via phone or email.</p>
          <ul>
            <li>Phone: 43439088812</li>
            <li>
              E-mail:
              <a href="mailto:something@something.com">something@something.com</a>
            </li>
          </ul>
        </div>
      )
    }
    // let content = null
    // if(this.open){
    //   content = (
    //     <aside>
    //       <header><h1>{this.title}</h1></header>
    //       <menu>
    //         <slot/>
    //       </menu> 
    //     </aside> 
    //   )
    // }
    // return content
    return (
      <aside>
        <header>
          <h1>{this.title}</h1>
          <button onClick={this.onCloseDrawer.bind(this)}>X</button>
        </header>
        <menu>
          <section id="tabs">
            <button class={!this.showContactInfo ? 'active' : ''} onClick={this.onContentChange.bind(this, 'navigation')}>Navigation</button>
            <button class={this.showContactInfo ? 'active' : ''} onClick={this.onContentChange.bind(this, 'contact')}>Contact</button>
          </section>
          {mainContent}
        </menu> 
      </aside> 
    )
  }
}