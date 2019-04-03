import { LitElement, html } from 'lit-element';
import gql from 'graphql-tag'
import client from '../client.js'
import './wcfactory-ui-button.js'
import './wcfactory-ui-factory-state.js'

export const FACTORY_FRAGMENT = gql`
  fragment FactoryInfo on Factory {
    __typename
    id
    name
    location
    output
  }
`

export const GET_FACTORIES = gql`
  query {
    factories {
      ...FactoryInfo
    }
  }
  ${FACTORY_FRAGMENT}
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
        query: GET_FACTORIES,
      }).subscribe(({ data: { factories }}) => {
        console.log('factories:', factories)
        this.factories = factories
      })
    } catch (error) {
    }
  }

  render() {
    return html`
      <style>
        :host {
          display: block;

        }
        #list {
          display: flex;
          flex-direction: column;
        }
        #list-item {
          display: flex;
          padding: 10px;
          color: inherit;
          text-decoration: none;
        }
        #list-item:hover, #list-item:focus {
          background: --list-item-hover-background;
        }
        #item-title {
          flex: 1 1 auto;
          margin: 0;
          font-size: 18px;
        }
        #item-desc {
          opacity: 0.7;
        }
      </style>
      <div id="list">
        ${this.factories.map(factory => html`
          <a id="list-item" href=${factory.output ? '' : `/factories/${factory.name}`}>
            <h2 id="item-title"> 🏭${factory.name} </h2>
            <div id="item-desc">
              ${factory.output
                ? html`<wcfactory-ui-factory-state .output=${factory.output}></wcfactory-ui-factory-state>`
                : html`${factory.location}`
              }
            </div>
          </a>
        `)}
      </div>
      <a href="/factories/create"><wcfactory-ui-button>🏭 Create factory</wcfactory-ui-button></a>
    `;
  }
}

customElements.define('wcfactory-ui-factories', WCFactoryUIFactories);