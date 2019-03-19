import { html, ApolloQuery } from 'lit-apollo';
import gql from 'graphql-tag'
import client from '../client.js'
import { fragment as scriptFragment } from './wcfactory-ui-active-script'

export const GET_ACTIVE_OPERATIONS = gql`
  query {
    operations {
      ...Script
    }
  }
  ${scriptFragment}
`

class WCFactoryUIActiveScripts extends ApolloQuery {
  constructor() {
    super()
    this.client = client
    this.query = GET_ACTIVE_OPERATIONS
  }
  render() {
    const { data, error, loading } = this;
    return html`
      Active Scripts ${data.operations.length}
      ${data.operations.map(operation =>
        html`
          <div>
            <wcfactory-ui-active-script .script=${operation}></wcfactory-ui-active-script>
          </div>
        `
      )}
    `
  }
}

customElements.define('wcfactory-ui-active-scripts', WCFactoryUIActiveScripts);