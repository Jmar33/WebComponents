class ConfirmLink extends HTMLAnchorElement {
  connectedCallback(){
    this.addEventListener('click', event => {
      if(!confirm('Do you really want to leave?')){
        event.preventDefault()
      }
    })
  }
}

//Quando extendemos um elemento específico, precisamos acrescentar o terceiro argumento 

customElements.define('uc-confirm-link', ConfirmLink, { extends: 'a'})