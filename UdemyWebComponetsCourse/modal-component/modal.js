class Modal extends HTMLElement{
  constructor(){
    super()
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
          top: 15vh;
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
        }

        header{
          padding: 1rem;
          
        }

        header h1{
          font-size: 1.25rem;
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
          <h1>Please confirm</h1>
        </header>
        <section id="main">
          <slot></slot>
        <section>
        <section id="actions">
          <button>Cancel</button>
          <button>Okay</button>
        </section>
      </div>
    `
  }

  attributeChangedCallback(name, oldValue, newValue){
    if(oldValue === newValue){
      return;
    }
    if(name === 'opened' && this.hasAttribute('opened')){
      const backdrop = this.shadowRoot.querySelector('#backdrop');
      const modal = this.shadowRoot.querySelector('#modal');
      backdrop.style.opacity = 1;
      backdrop.style.pointerEvents = 'all';
      modal.style.opacity = 1;
      modal.style.pointerEvents = 'all';
    }

  }

  static get observedAttributes(){
    return ['opened']
  }
}

customElements.define('uc-modal', Modal)