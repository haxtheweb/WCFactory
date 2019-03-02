import { LitElement, html } from 'lit-element';
import gql from 'graphql-tag'
import client from '../client.js'

const query = gql`
  query {
    factories {
      name
    }
  }
`;

class WCFactoryUIFactories extends LitElement {
  static get properties() {
    return {
      factories: { type: Array } 
    }
  }

  constructor() {
    super()
    this.factories = []

    try {
      client.watchQuery({
        query,
      }).subscribe(({ data: { factories }}) => {
        this.factories = factories
      })
    } catch (error) {
    }
  }


  render() {
    return html`
      listing of factories
      <ul>
        ${this.factories.map(factory => html`
            <li><a href="/factories/${factory.name}">🏭 ${factory.name}</a></li>
          `)}
      </ul>
    `;
  }
}

customElements.define('wcfactory-ui-factories', WCFactoryUIFactories);