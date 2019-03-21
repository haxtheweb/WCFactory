import { html, ApolloQuery } from 'lit-apollo';
import gql from 'graphql-tag'
import client from '../client.js'

export const GET_ACTIVE_OPERATIONS = gql`
  query {
    operations {
      pid
      location
      script
      element {
        name
      }
    }
  }
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