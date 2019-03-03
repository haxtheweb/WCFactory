import { LitElement, html } from 'lit-element';
import gql from 'graphql-tag'
import client from '../client.js'
import '@vaadin/vaadin-list-box/vaadin-list-box.js';

const query = gql`
  query {
    factories {
      name
      location
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
          <a id="list-item" href="/factories/${factory.name}">
            <h2 id="item-title"> 🏭${factory.name} </h2>
            <div id="item-desc"> ${factory.location} </div>
          </a>
        `)}
      </div>
    `;
  }
}

customElements.define('wcfactory-ui-factories', WCFactoryUIFactories);