import { html, ApolloQuery } from 'lit-apollo'
import gql from 'graphql-tag'
import client from '../client.js'
import './wcfactory-ui-terminal.js'

const GET_OPERATION_OUTPUT = gql`
  query($pid: Int!) {
    operationOutput(pid: $pid) {
      id
      output
    }
  }
`

class WCFactoryUIActiveScript extends ApolloQuery {
  static get properties() {
    return {
      script: { type: Object }
    }
  }
  constructor() {
    super()
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
    if (data) {
      return html`
        <wcfactory-ui-terminal>
          <div>${data.operationOutput.map(i => html`${i.output}`)}</div>
        </wcfactory-ui-terminal>
      `
    }
    if (loading) return html`loading...`
  }
}

customElements.define('wcfactory-ui-active-script', WCFactoryUIActiveScript);