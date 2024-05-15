class ButtonComponent extends HTMLButtonElement{
  connectedCallback(){
    this.addEventListener('click', () => {
      const infoEl = document.querySelector('p');
      let isHidden = infoEl.style.display === 'none';
      if (isHidden) {
        infoEl.style.display = 'block';
        this.textContent = 'Hide';
        isHidden = false;
      } else {
        infoEl.style.display = 'none';
        this.textContent = 'Show';
        isHidden = true;
      }
    });
  }
}

customElements.define('uc-button', ButtonComponent, {extends: 'button'})