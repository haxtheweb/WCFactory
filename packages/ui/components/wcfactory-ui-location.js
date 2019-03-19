import { html, ApolloMutation } from 'lit-apollo';
import gql from 'graphql-tag'
import client from '../client.js'

const OPEN_LOCATION_MUTATION = gql`
  mutation($location: String!) {
    openLocation(location: $location)
  }
`

class WCFactoryUILocation extends ApolloMutation {
  static get properties() {
    return {
      location: { type: String }
    }
  }

  render() {
    // set up mutation open location mutation
    this.client = client
    this.mutation = OPEN_LOCATION_MUTATION
    this.variables = { location: this.location }

    return html`
      <style>
        :host {
          display: block;
        }
        #location {
          cursor: pointer;
        }
      </style>
      <div id="location" @click=${this.mutate}>
        📁 ${this.location}
      </div>
    `;  
  }

}

customElements.define('wcfactory-ui-location', WCFactoryUILocation);