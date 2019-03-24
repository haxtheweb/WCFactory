import { html, ApolloQuery } from 'lit-apollo'
import gql from 'graphql-tag'
import client from '../client.js'
import './wcfactory-ui-terminal.js'

export const GET_OPERATION_OUTPUT = gql`
  query($pid: Int!) {
    operationOutput(pid: $pid) {
      id
      output
      operation {
        pid
      }
    }
  }
`

class WCFactoryUIActiveScript extends ApolloQuery {
  static get properties() {
    return {
      script: { type: Object },
      active: { type: Boolean, reflect: true }
    }
  }
  constructor() {
    super()
    this.active = true
    this.script = {}
  }
  firstUpdated() {
    this.client = client
    this.query = GET_OPERATION_OUTPUT
    this.variables = { pid: this.script.pid }
  }
  shouldUpdate(changedProps) {
    return true
  }
  render() {
    const { data, loading, error } = this
    const active = this.active
    if (data) {
      return html`
        <style>
          :host {
            display: block;
            background: var(--wcfactory-ui-secondary-color);
          }
          #header {
            font-size: .6em;
            padding: 1em;
          }
          :host[active] {
            display: none;
          }
          wcfactory-ui-terminal {
            --wcfactory-ui-terminal-bg: calc(var(--wcfactory-ui-secondary-color) * 0.9);
          }
        </style>
        <div id="header" @click=${() => this.active = !this.active}>${this.script.element.name}</div>
        <div id="body">
          <wcfactory-ui-terminal>
            ${data.operationOutput.map(i => html`<div>${i.output}</div>`)}
          </wcfactory-ui-terminal>
        </div>
      `
    }
    if (loading) return html`loading...`
  }
}

customElements.define('wcfactory-ui-active-script', WCFactoryUIActiveScript);