import { LitElement, html } from 'lit-element';
import gql from 'graphql-tag'

class WCFactoryUIElement extends LitElement {
  static get properties() {
    return {
      element: { type: Object } 
    }
  }

  constructor() {
    super()
    this.element = {}
  }


  render() {
    return html`
    `;
  }
}

customElements.define('wcfactory-ui-element', WCFactoryUIElement);