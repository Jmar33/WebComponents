class Modal extends HTMLElement{
  constructor(){
    super()
    this.isOpen = false
    this.attachShadow({mode: 'open'})
  }

  connectedCallback(){
    this.shadowRoot.innerHTML = `
      <style>
        #backdrop{
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          background-color: rgba(0,0,0,0.75);
          z-index: 10;
          opacity: 0;
          pointer-events: none;
        }

        #modal{
          position: fixed;
          top: 10vh;
          left: 25%;
          width: 50%;
          z-index: 100;
          background-color: white;
          border-radius: 3px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.26);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          opacity: 0;
          pointer-events: none;
          transition: all 0.3s ease-out

        }

        :host([opened]) #backdrop,
        :host([opened]) #modal{
          opacity: 1;
          pointer-events: all;
        }

        :host([opened]) #modal{
          top: 15vh;
        }

        header{
          padding: 1rem;
          border-bottom: 1px solid #ccc;
          
        }

        header h1{
          font-size: 1.25rem;
        }

        ::slotted(h1){
          font-size: 1.25rem;
          margin: 0;
        }

        #main{
          padding: 1rem;
        }

        #actions{
          padding: 1rem;
          border-top: 1px solid #ccc;
          display: flex;
          justify-content: flex-end; 
        }

        #actions button{
          margin: 0 0.25rem;
        }
      </style>
      <div id="backdrop"></div>
      <div id="modal">
        <header class="header">
          <slot name="title"></slot>
        </header>
        <section id="main">
          <slot></slot>
        <section>
        <section id="actions">
          <button id="btn-cancel">Cancel</button>
          <button id="btn-confirm">Okay</button>
        </section>
      </div>
    `
    const slots = this.shadowRoot.querySelectorAll('slot')
    slots[1].addEventListener('slotchange', event => {
      console.dir(slots[1].assignedNodes())
    })

    const cancelButton = this.shadowRoot.querySelector('#btn-cancel')
    const confirmButton = this.shadowRoot.querySelector('#btn-confirm')
    const backdrop = this.shadowRoot.querySelector('#backdrop')
    backdrop.addEventListener('click', this._cancel.bind(this))
    cancelButton.addEventListener('click', this._cancel.bind(this))
    confirmButton.addEventListener('click', this._confirm.bind(this))
    cancelButton.addEventListener('cancel', event => {
      console.log('Canel was dispatch...')
    })
  }
  // Como estamos acrescentando uma propriedade css, podemos abrir o modal por meio dos seletores CSS

  attributeChangedCallback(name, oldValue, newValue){
    if(oldValue === newValue){
      return;
    }
    if(name === 'opened' && this.hasAttribute('opened')){
      this.isOpen = true;
    }else{
      this.isOpen = false;
    }

  }

  static get observedAttributes(){
    return ['opened']
  }

  open(){
    this.setAttribute('opened', '')
    this.isOpen = true;
  }

  _cancel(event){
    this.hide()
    const cancelEvent = new Event('cancel', {bubbles: true, composed: true})
    event.target.dispatchEvent(cancelEvent)
  }

  _confirm(){
    this.hide()
    const confirmEvent = new Event('confirm')
    this.dispatchEvent(confirmEvent)
  }

  hide(){
    if(this.hasAttribute('opened')){
      this.removeAttribute('opened')
    }
    this.isOpen = false
  }
}

customElements.define('uc-modal', Modal)