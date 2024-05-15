//Extendemos da class HTMLElement porque no fundo a ideia é que o nosso componente se comporte como um elemento HTML
class Tooltip extends HTMLElement{
  constructor(){
    super()
    this._tooltipContainer
    this._tooltipText = 'Some dummy tooltip text.'
    this.attachShadow({mode: 'open'}) //Associa um componente ao shadow root assim, ele passa a ser desacoplado do light DOM, não interferindo ou sofrendo interferência 
                                      //do restante dos componentes
  }

  //Esse é um ciclo de vida de um web componente que é chamado todas as vezes que um web componente é associado a DOM
  connectedCallback(){
    if(this.hasAttribute('text')){
      this._tooltipText = this.getAttribute('text')
    }
    const tooltipIcon = document.createElement('span')
    tooltipIcon.textContent =  ' (?)'
    tooltipIcon.addEventListener('mouseenter', this._showTooltip.bind(this))
    tooltipIcon.addEventListener('mouseleave', this._hideTooltip.bind(this))
    this.shadowRoot.appendChild(tooltipIcon)
    this.style.position = 'relative'
  }

  _showTooltip(){
    this._tooltipContainer = document.createElement('div')
    this._tooltipContainer.textContent = this._tooltipText
    this._tooltipContainer.style.backgroundColor = 'black'
    this._tooltipContainer.style.color = 'white'
    this._tooltipContainer.style.position = 'absolute'
    this._tooltipContainer.style.zIndex = '10'
    this.shadowRoot.appendChild(this._tooltipContainer)
  }

  _hideTooltip(){
    this.shadowRoot.removeChild(this._tooltipContainer)
  }
}

//CustomElements é um objeto utilizado para definir web components personalizados
//Obrigatóriamente um web component deve possuir um nome com pelo menos duas palavras separadas por um '-'
customElements.define('uc-tooltip', Tooltip)