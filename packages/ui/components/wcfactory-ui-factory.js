import { LitElement, html } from 'lit-element';
import gql from 'graphql-tag'
import Fuse from 'fuse.js'
import client from '../client.js'
import './wcfactory-ui-element.js'
import './wcfactory-ui-search.js'
import './wcfactory-ui-scripts.js'
import './wcfactory-ui-location.js'
import './wcfactory-ui-button.js'

class WCFactoryUIFactory extends LitElement {
  static get properties() {
    return {
      location: { type: Object },
      loading: { type: Boolean },
      factory: { type: Object },
      activeElement: { type: String },
      elementFilter: { type: String }
    }
  }

  constructor() {
    super()
    this.factory = null
    this.loading = true
    this.activeElement = null
    this.elementFilter = ''
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
      // setup fuzzy search
      var fuse = new Fuse(this.factory.elements, {keys: ['name'], minMatchCharLength: 2})
      const filteredElements = (this.elementFilter !== '') ? fuse.search(this.elementFilter) : this.factory.elements

      // render
      return html`
        <style>
          :host {
            --wcfactory-ui-factory-font-size: 16px;
            display: block;
            font-size: var(--wcfactory-ui-factory-font-size);
          }
          #wrapper {
            background: rgba(0,0,0, 0.1);
            padding: calc(var(--wcfactory-ui-factory-font-size) * 1.2);
          }
          .spacer {
            flex: 1 1 auto;
          }
          *[aria-role="button"] {
            cursor: pointer;
          }
          #factory-info {
            display: flex;
            flex-wrap: wrap;
          }
          #factory-info wcfactory-ui-scripts {
            --wcfactory-ui-scripts-font-size: 14px;
          }
          #factory-info + #filter {
            --wcfactory-ui-factory-filter-margin-top: 3em;
            margin-top: var(--wcfactory-ui-factory-filter-margin-top);
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
            max-height: 100vh;
            transform: scale(1.1);
            transition: all 0.4s ease-in-out;
            margin-top: -50px;
            box-shadow: 1px 1px 1px rgba(0,0,0, 0.2)
          }
        </style>

        <div id="wrapper">
          <div id="factory-info">
            <div class="name">🏭 ${this.factory.name}</div>
            <div class="spacer"></div>
            <wcfactory-ui-location location=${this.factory.location}></wcfactory-ui-location> <br>
          </div>

          <div id="filter">
            <wcfactory-ui-search
              placeholder="element name"
              @input=${e => this.elementFilter = e.composedPath()[0].value}>
            </wcfactory-ui-search> <span id="elementCount">(${this.factory.elements.length})</span>
          </div>

          <div id="elements">
              ${filteredElements
                .map(element => html`
              <div id="element-container" active=${(element.name === this.activeElement)}>
                <div id="element"
                  @click=${this._activateItemHander}
                  @keypress=${this._activateItemHander}
                  data-name=${element.name}
                  aria-role="button"
                  aria-haspopup="true"
                  aria-pressed=${(element.name === this.activeElement)}
                  tabindex="1"> 
                  ∈ ${element.name}
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

          <a><wcfactory-ui-button disabled>Create Element (coming soon)</wcfactory-ui-button></a>
        </div>
      `;
    }
  }

  fetchFactory(factory) {
    try {
      client.watchQuery({
        query: gql`
        query($name: String!) {
          factory(name: $name) {
            name
            location
            scripts
            elements {
              id
              name
              location
              version
              scripts
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