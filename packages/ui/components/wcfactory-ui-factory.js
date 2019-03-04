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
          *[aria-role="button"] {
            cursor: pointer;
          }
          #element-container {
            display: block;
            font-family: inherit;
            border: none;
            padding: 0;
            margin: 0;
            color: inherit;
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
              <div id="element"
                @click=${this._activateItemHander}
                @keypress=${this._activateItemHander}
                data-name=${element.name}
                aria-role="button"
                aria-haspopup="true"
                aria-pressed=${(element.name === this.activeElement)}
                tabindex="1"> 
                📦 ${element.name}
              </div>
              <div id="element-item-container" tabindex=${((element.name === this.activeElement) ? '1' : null)}>
                <wcfactory-ui-element
                  .element=${element}
                  tabindex=${((element.name === this.activeElement) ? '1' : null)}>
                </wcfactory-ui-element>
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

  _activateItemHander(e) {
    let selection = false
    // if it's a click
    if (e.type === 'click') {
      selection = true
    }
    // or if its a space or enter
    else if (typeof e.keyCode !== 'undefined') {
      if (e.keyCode === 13 || e.keyCode === 32) {
        selection = true
      }
    }
    // if selection is good then we'll pop open the dialog
    if (selection) {
      // change active item
      this.activeElement = e.target.dataset.name
      // forward focus to dialog
      e.target.nextSibling.focus()
    }
  }
}

customElements.define('wcfactory-ui-factory', WCFactoryUIFactory);