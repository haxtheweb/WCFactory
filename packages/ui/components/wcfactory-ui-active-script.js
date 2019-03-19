import { LitElement, html } from 'lit-element';
import gql from 'graphql-tag'
import client from '../client.js'

/**
 * Define what info we need from our parent
 */
export const fragment = gql`
  fragment Script on Operation {
    pid
    location
    script
  }
`

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
      ${this.script.location}
    `
  }
}

customElements.define('wcfactory-ui-active-script', WCFactoryUIActiveScript);