import { LitElement, html } from 'lit-element';
import gql from 'graphql-tag'
import client from '../client.js'

const GET_OPERATIONS = gql`
  query {
    operations {
      script
      location
    }
  }
`

const SUBSCRIBE_OPERATIONS_UPDATE = gql`
  subscription {
    operationsUpdate
  }
`

const SUBSCRIBE_OPERATIONS_CHILD_PROCESS = gql`
  subscription {
    operationsChildProcess
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
    // setup subscribe to operations
    this.subscribeToOperations()
    // setup subscribe to operations
    this.subscribeToOperationsChildProcess()
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
        }
      </style>
        ${this.activeScript}
        ${this.script}
        ${this.scripts.map(script => {
          if (this.operations.find(i => (i.script === script && i.location === this.location))) {
            return html`
              <span
                class="script"
                active=${(this.activeScript === script)}> 🔄${script} </span>`
          }
          else {
            return html`
              <button
                class="script"
                @click=${e => this.runScript(script, this.location)}> 🚀${script} </button>`
          }
        })}
        <div id="output"></div>
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

  subscribeToOperations() {
    window.WCFactoryUI = Object.assign({}, { SUBSCRIBE_OPERATIONS_UPDATE: 'subscribed' })
    client.subscribe({
      query: SUBSCRIBE_OPERATIONS_UPDATE
    }).subscribe(({ data: { operationsUpdate } }) => {
      const data = client.readQuery({ query: GET_OPERATIONS })
      const operation = JSON.parse(operationsUpdate)
      data.operations = [...data.operations, operation]
      client.writeQuery({ query: GET_OPERATIONS, data })
    })
  }

  subscribeToOperationsChildProcess() {
    window.WCFactoryUI = Object.assign({}, { SUBSCRIBE_OPERATIONS_CHILD_PROCESS: 'subscribed' })
    client.subscribe({
      query: SUBSCRIBE_OPERATIONS_CHILD_PROCESS
    }).subscribe(({ data: { operationsChildProcess } }) => {
      this.shadowRoot.getElementById('output').innerHTML = operationsChildProcess
    })
  }
}

customElements.define('wcfactory-ui-scripts', WCFactoryUIScripts);