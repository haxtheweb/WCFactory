import { html, ApolloMutation } from 'lit-apollo';
import gql from 'graphql-tag'
import client from '../client.js'
import { GET_OPERATIONS } from './wcfactory-ui-script'

export const STOP_SCRIPT_MUTATION = gql`
  mutation($script: String!, $location: String!) {
    stopScript(script: $script, location: $location)
  }
`

class WCFactoryUIScriptStop extends ApolloMutation {
  static get properties() {
    return {
      script: { type: String },
      location: { type: String }
    }
  }

  render() {
    this.client = client
    this.mutation = STOP_SCRIPT_MUTATION
    this.variables = {
      script: this.script,
      location: this.location
    }
    this.onUpdate = (store, { data: { stopScript }}) => {
      // if we successfully stoped the script then update local cache
      if (stopScript) {
        const cache = store.readQuery({ query: GET_OPERATIONS })
        const operations = cache.operations.filter(i => !(i.script === this.script && i.location === this.location))
        store.writeQuery({ query: GET_OPERATIONS, data: Object.assign({}, cache, { operations }) })
      }
    }

    // set up the mutation
    return html`
      <style>
        :host {
          --wcfactory-ui-script-font-size: 12px;
          font-size: var(--wcfactory-ui-script-font-size);
        }
        button {
          font-family: inherit;
          border: none;
          margin: 0;
          padding: 0;
          background: none;
          color: inherit;
          cursor: pointer;
          font-size: var(--wcfactory-ui-script-font-size);
        }
        .script {
          cursor: pointer;
          padding: calc(var(--wcfactory-ui-script-font-size) * .6);
        }

        .script[active="true"] {
          background: black;
        }
      </style>

      <button
        class="script"
        @click=${this.mutate}>
          ❌ ${this.script}
      </button>
    `
  }
}

customElements.define('wcfactory-ui-script-stop', WCFactoryUIScriptStop);