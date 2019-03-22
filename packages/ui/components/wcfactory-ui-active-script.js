import { LitElement, html } from 'lit-element';
import gql from 'graphql-tag'
import client from '../client.js'


class WCFactoryUIActiveScript extends LitElement {
  static get properties() {
    return {
      script: { type: Object }
    }
  }
  constructor() {
    super()
  }
  render() {
    return html`
      ${this.script.element.name}
    `
  }
}

customElements.define('wcfactory-ui-active-script', WCFactoryUIActiveScript);