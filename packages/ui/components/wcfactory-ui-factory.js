import { LitElement, html } from 'lit-element';
import gql from 'graphql-tag'
import client from '../client.js'
import './wcfactory-ui-element.js'

class WCFactoryUIFactory extends LitElement {
  static get properties() {
    return {
      location: { type: Object },
      loading: { type: Boolean },
      factory: { type: Object },
      activeElement: { type: String }
    }
  }

  constructor() {
    super()
    this.factory = null
    this.loading = true
    this.activeElement = null
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
        <style>
          :host {
            display: block;
          }
          #element {
            display: flex;
            flex-direction: column;
            padding: 10px;
          }
          #element:hover, #element:focus {
            background-color: var(--list-item-hover-background);
          }
          #element-item-container {
            max-height: 0;
            display: block;
            overflow: hidden;
          }
          #element-container[active="true"] {
            margin: 20px;
          }
          #element-container[active="true"] #element-item-container {
            max-height: 400px;
            transform: scale(1.1);
            transition: all 0.4s ease-in-out;
            margin-top: -50px;
            box-shadow: 1px 1px 1px rgba(0,0,0, 0.2)
          }
        </style>

        Name: ${this.factory.name} <br>
        Location: ${this.factory.location} <br>
        Elements: (${this.factory.elements.length})

        <div id="elements">
            ${this.factory.elements.map(element => html`
            <div id="element-container" active=${(element.name === this.activeElement)}>
              <div id="element" @click=${(() => this.activeElement = element.name)}> 📦 ${element.name} </div>
              <div id="element-item-container">
                <wcfactory-ui-element .element=${element}></wcfactory-ui-element>
              </div>
            </div>
            `)}
        </div>
      `;
    }
  }

  fetchFactory(factory) {
    try {
      client.watchQuery({
        query: gql`
        query($name: ID!) {
          factory(name: $name) {
            name
            location
            elements {
              name
              location
              version
            }
          }
        }
      `,
        variables: {
          name: factory
        }
      }).subscribe(({ data: { factory } }) => {
        this.loading = false
        this.factory = factory
      })
    } catch (error) {
    }
  }
}

customElements.define('wcfactory-ui-factory', WCFactoryUIFactory);