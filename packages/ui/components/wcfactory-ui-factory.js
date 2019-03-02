import { LitElement, html } from 'lit-element';
import gql from 'graphql-tag'
import client from '../client.js'

const query = gql`
  query($name: ID!) {
    factory(name: $name) {
      name
      location
      elements {
        name
        location
      }
    }
  }
`;

class WCFactoryUIFactory extends LitElement {
  static get properties() {
    return {
      location: { type: Object },
      loading: { type: Boolean },
      factory: { type: Object }
    }
  }

  constructor() {
    super()
    this.factory = null
    this.loading = true
  }

  render() {
    // notice location changed
    const { factory } = this.location.params
    // update factory
    this.fetchFactory(factory)

    // render
    if (this.loading) {
      return html`loading...`
    }
    else if (this.factory) {
      return html`
        Name: ${this.factory.name} <br>
        Location: ${this.factory.location} <br>
        Elements: (${this.factory.elements.length})
          <ul>
            ${this.factory.elements.map(element => html`
                <li>${element.name}</li>
              `)}
          </ul>
      `;
    }
  }

  fetchFactory(factory) {
    try {
      client.watchQuery({
        query,
        variables: {
          name: factory
        }
      }).subscribe(({ data: { factory }}) => {
        this.loading = false
        this.factory = factory
      })
    } catch (error) {
    }
  }
}

customElements.define('wcfactory-ui-factory', WCFactoryUIFactory);