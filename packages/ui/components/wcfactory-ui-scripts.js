import { LitElement, html } from 'lit-element';
import gql from 'graphql-tag'
import client from '../client.js'

const SUBSCRIBE_OPERATIONS_UPDATE = gql`
  subscription {
    operationsUpdate
  }
`

const subscribeToOperations = () => {
  client.subscribe({
    query: SUBSCRIBE_OPERATIONS_UPDATE
  }).subscribe(({ data: { operationsUpdate } }) => {
    const data = client.readQuery({ query: GET_OPERATIONS })
    const operation = JSON.parse(operationsUpdate)
    data.operations = [...data.operations, operation]
    client.writeQuery({ query: GET_OPERATIONS, data })
  })
}

// start subscriptions
subscribeToOperations()

const GET_OPERATIONS = gql`
  query {
    operations {
      script
      location
      pid
      output
    }
  }
`

class WCFactoryUIScripts extends LitElement {
  static get properties() {
    return {
      scripts: { type: Array },
      operations: { type: Array },
      location: { type: Array },
      activeScript: { type: String }
    }
  }

  constructor() {
    super()
    this.scripts = {}
    this.operations = []
    this.activeScript = ''
  }

  firstUpdated() {
    // fetch operations
    this.fetchOperations()
  }

  render() {
    return html`
      <style>
        button {
          font-family: inherit;
          border: none;
          margin: 0;
          padding: 0;
          background: none;
          color: inherit;
          cursor: pointer
        }
        .script {
          margin-right: 10px;
          padding: 5px;
        }

        .script[active="true"] {
          background: black;
        }

        #output {
          background: black;
          height: 100px;
          overflow-x: hidden;
          overflow-y: scroll;
          font-size: 10px;
        }
      </style>
        ${this.activeScript}
        ${this.script}
        ${this.scripts.map(script => {
          console.log(this.operations)
          const currentOperation = this.operations.find(i => (i.script === script && i.location === this.location))
          if (currentOperation) {
            return html`
              <span
                class="script"
                active=${(this.activeScript === script)}> 🔄${script} </span>
              <div id="output">${currentOperation.output.map(o => html`${o} <br/>`)}</div>
            `
          }
          else {
            return html`
              <button
                class="script"
                @click=${e => this.runScript(script, this.location)}> 🚀${script} </button>`
          }
        })}
    `
  }

  async runScript(script, location) {
    try {
      await client.mutate({
        mutation: gql`
          mutation($script: String!, $location: String!) {
            runScript(script: $script, location: $location)
          }
        `,
        variables: { script, location }
      })
    } catch (error) {}
  }

  fetchOperations() {
    try {
      client.watchQuery({
        query: GET_OPERATIONS,
      }).subscribe(({ data: { operations } }) => {
        this.operations = operations
      })
    } catch (error) {
    }
  }
}

customElements.define('wcfactory-ui-scripts', WCFactoryUIScripts);
