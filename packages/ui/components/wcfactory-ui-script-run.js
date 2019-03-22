import { html, ApolloMutation } from 'lit-apollo';
import gql from 'graphql-tag'
import client from '../client.js'
import { GET_OPERATIONS } from './wcfactory-ui-script.js'

export const RUN_SCRIPT_MUTATION = gql`
  mutation($script: String!, $location: String!) {
    runScript(script: $script, location: $location) {
      id
      location
      script
    }
  }
`

class WCFactoryUIScriptRun extends ApolloMutation {
  static get properties() {
    return {
      script: { type: String },
      location: { type: String }
    }
  }

  render() {
    this.client = client
    this.mutation = RUN_SCRIPT_MUTATION
    this.variables = {
      script: this.script,
      location: this.location
    }
    this.onUpdate = (store, { data: { runScript }}) => {
      // if we successfully stoped the script then update local cache
      const cache = store.readQuery({ query: GET_OPERATIONS })
      const operations = [...cache.operations, runScript]
      store.writeQuery({ query: GET_OPERATIONS, data: Object.assign({}, cache, { operations }) })
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
          🚀${this.script}
      </button>
    `
  }
}

customElements.define('wcfactory-ui-script-run', WCFactoryUIScriptRun);