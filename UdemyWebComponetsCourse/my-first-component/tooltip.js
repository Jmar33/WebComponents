//Extendemos da class HTMLElement porque no fundo a ideia é que o nosso componente se comporte como um elemento HTML
class Tooltip extends HTMLElement{
  constructor(){
    super()
    this._tooltipIcon
    this._tooltipVisible = false;
    this._tooltipText = 'Some dummy tooltip text.'
    this.attachShadow({mode: 'open'}) //Associa um componente ao shadow root assim, ele passa a ser desacoplado do light DOM, não interferindo ou sofrendo interferência 
                                      //do restante dos componentes
    this.shadowRoot.innerHTML = `
      <style>
        div {
          font-weight: normal;
          background-color: black;
          color: white;
          position: absolute;
          top: 1.5rem;
          left: 0.75rem;
          z-index: 10;
          padding: 0.15rem;
          border-radius: 3px;
          box-shadow: 1px 1px 6px (0,0,0,0.26);
        }

        .highlight{
          background-color: red;
          
        }

        ::slotted(.highlight){
          border-bottom: 1px dotted red;
        }

        :host(.important){
          background-color: var(--color-primary, #ccc);
          padding: .15rem;
        }

        :host-context(p){
          font-weight: bold;
        }

        .icon{
          background-color: black;
          color: white;
          padding: 0.15rem 0.5rem;
          text-align: center;
          border-radius: 50%;
        }
      </style>
      <slot>Some default </slot>
      <span class="icon">?</span> 
    `
  }

  //Esse é um ciclo de vida de um web componente que é chamado todas as vezes que um web componente é associado a DOM
  connectedCallback(){
    if(this.hasAttribute('text')){
      this._tooltipText = this.getAttribute('text')
    }
    this._tooltipIcon = this.shadowRoot.querySelector('span')
    tooltipIcon.addEventListener('mouseenter', this._showTooltip.bind(this))
    tooltipIcon.addEventListener('mouseleave', this._hideTooltip.bind(this))
    this.style.position = 'relative'
  }

  //Essa callback é executada quando alteramos o valor de alguma propriedade
  attributeChangedCallback(name, oldValue, newValue){
    console.log(name, oldValue, newValue);
    if(oldValue === newValue){
      return;
    }
    if(name === 'text'){
      this._tooltipText = newValue;
    }

  }

  // Por padrão o JS não monitora nenhuma propriedade, caso estejamos interessados na mudança de valor de alguma propriedade
  // devemos explicitar através de um 'get'
  static get observedAttributes() {
    return ['text'] 
  }

  disconnectedCallback(){
    this._tooltipIcon.removeEventListener('mouseenter', this._showTooltip)
    this._tooltipIcon.removeEventListener('mouseleave', this._hideTooltip)
  }

  _render(){
    let tooltipContainer = this.shadowRoot.querySelector('div')
    if(this._tooltipVisible){
      tooltipContainer = document.createElement('div')
      tooltipContainer.textContent = this._tooltipText
      this.shadowRoot.appendChild(tooltipContainer)
    }else{
      if(tooltipContainer){
        this.shadowRoot.removeChild(tooltipContainer)
      }
    }
  }

  _showTooltip(){
    this._tooltipVisible = true
    this._render()
  }

  _hideTooltip(){
    this._tooltipVisible = false
    this._render()
  }
}

//CustomElements é um objeto utilizado para definir web components personalizados
//Obrigatóriamente um web component deve possuir um nome com pelo menos duas palavras separadas por um '-'
customElements.define('uc-tooltip', Tooltip)