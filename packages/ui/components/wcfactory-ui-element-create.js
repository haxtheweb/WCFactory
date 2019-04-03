import { LitElement, html } from 'lit-element';
import gql from 'graphql-tag'
import client from '../client.js'
import './wcfactory-ui-element-create-form.js'

export class WCFactoryUIElementCreate extends LitElement {
  static get properties() {
    return {
      loading: { type: Boolean },
      location: { type: Object }
    }
  }

  render() {
    return html`
      <wcfactory-ui-element-create-form .factory=${this.location.params.factory}></wcfactory-ui-element-create-form>
    `;
  }

}

customElements.define('wcfactory-ui-element-create', WCFactoryUIElementCreate);