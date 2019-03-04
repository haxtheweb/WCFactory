import { LitElement, html } from 'lit-element';

class WCFactoryUISearch extends LitElement {
  static get properties() {
    return {
      placeholder: { type: String }
    }
  }
  constructor() {
    super()
    this.placeholder = ''
  }
  render() {
    return html`
      <style>
        input {
        }
      </style>
      <label><slot name="label"></slot></label>
      <input type="text" placeholder=${this.placeholder}>
    `;  
  }
}

customElements.define('wcfactory-ui-search', WCFactoryUISearch);