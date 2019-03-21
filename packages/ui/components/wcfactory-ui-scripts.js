import { html, LitElement } from 'lit-element';
import gql from 'graphql-tag'
import client from '../client.js'
import './wcfactory-ui-script.js'

class WCFactoryUIScripts extends LitElement {
  static get properties() {
    return {
      scripts: { type: Array },
      location: { type: String }
    }
  }
  render() {
    return html`
      ${this.scripts.map(script => {
        return html`<wcfactory-ui-script .script=${script} .location=${this.location}></wcfactory-ui-script>`
      })}
    `
  }
}

customElements.define('wcfactory-ui-scripts', WCFactoryUIScripts);