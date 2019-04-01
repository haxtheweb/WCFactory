import { LitElement, html } from 'lit-element';

class WCFactoryUIFactoryCreate extends LitElement {

  constructor() {
    super()
  }

  render() {
    // notice location changed
    return html`hi there form`
  }

}

customElements.define('wcfactory-ui-factory-create', WCFactoryUIFactoryCreate);