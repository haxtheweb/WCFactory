import { html, ApolloQuery } from 'lit-apollo';
import gql from 'graphql-tag'
import client from '../client.js'
import './wcfactory-ui-active-script.js'
import './wcfactory-ui-desktop-tabs.js'
import './wcfactory-ui-desktop-tab.js'
import { GET_OPERATIONS } from './wcfactory-ui-script.js'

class WCFactoryUIActiveScripts extends ApolloQuery {
  constructor() {
    super()
    this.client = client
    this.query = GET_OPERATIONS
  }
  render() {
    const { data, error, loading } = this;
    return html`
      <style>
        :host {
          display: block;
          position: fixed;
          right: 0;
          bottom: 0;
          z-index: 100;
        }
        #tabs {
          display: flex;
        }
        #container {
          max-width: 300px;
        }
      </style>
    
    <wcfactory-ui-desktop-tabs>
      ${data.operations.map(operation => {
        return html`
          <wcfactory-ui-desktop-tab active>
            <span slot="header">${operation.element.name}</span>
            <wcfactory-ui-active-script .script=${operation}></wcfactory-ui-active-script>
          </wcfactory-ui-desktop-tab>
        `
      })}
    </wcfactory-ui-desktop-tabs>

    `
  }
}

customElements.define('wcfactory-ui-active-scripts', WCFactoryUIActiveScripts);