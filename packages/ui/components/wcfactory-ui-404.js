import { LitElement, html } from "lit";

class WCFactoryUI404 extends LitElement {
  render() {
    return html`
      that path does not exist 😔
    `;  
  }
}

customElements.define('wcfactory-ui-404', WCFactoryUI404);