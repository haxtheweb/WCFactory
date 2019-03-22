import { html, ApolloQuery } from 'lit-apollo';
import gql from 'graphql-tag'
import client from '../client.js'
import './wcfactory-ui-active-script.js'
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
      <h3>Active Scripts (${data.operations.length})</h3>
      ${data.operations.map(operation => {
        return html`
          <div>
            <wcfactory-ui-active-script .script=${operation}></wcfactory-ui-active-script>
          </div>
        `
      })}
    `
  }
}

customElements.define('wcfactory-ui-active-scripts', WCFactoryUIActiveScripts);