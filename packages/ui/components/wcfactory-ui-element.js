import { LitElement, html } from 'lit-element';
import gql from 'graphql-tag'
import client from '../client.js'

class WCFactoryUIElement extends LitElement {
  static get properties() {
    return {
      element: { type: Object },
      operations: { type: Array }
    }
  }

  constructor() {
    super()
    this.element = {}
    this.operations = []
  }

  render() {
    return html`
      <style>
        :host {
          display: flex;
          background: var(--wcfactory-ui-secondary-color);
          padding: 10px;
          min-height: 100px;
          flex-direction: column;
        }
        button {
          font-family: inherit;
          border: none;
          margin: 0;
          padding: 0;
          background: none;
          color: inherit;
          cursor: pointer
        }
        button:hover, button:focus {
          color: white;
        }
        #header {
          display: flex;
        }
        #title {
          flex: 1 1 auto;
        }
        #middle {
          flex: 1 1 auto;
          font-size: 14px;
          opacity: 0.7;
          font-family: inherit;
          border: none;
          margin: 0;
          padding: 0;
          background: none;
          color: inherit;
          margin: 10px 0;
        }
        #location {
          font-size: 14px;
          opacity: 0.7;
          font-family: inherit;
          border: none;
          margin: 0;
          padding: 0;
          background: none;
          color: inherit;
          cursor: pointer;
        }
      </style>
      <div id="header">
        <div id="title"> ${this.element.name} </div>
        <div id="version"> 📦${this.element.version} </div>
      </div>
      <div id="middle">
        ${this._renderScripts(this.element, this.operations)}
      </div>
      <div id="footer">
        <button id="location" @click=${this._locationClicked}>📁${this.element.location} </button>
      </div>
    `;
  }

  _renderScripts(element, operations) {
    this.fetchOperations()
    return html`
      <style>
        .script {
          margin-right: 10px;
        }
      </style>
      <div id="scripts">
        ${element.scripts.map(script => {
          if (operations.find(i => (i.script === script && i.location === element.location))) {
            return html`
              <span class="script">
                🔄${script}
              </span>
            `
          }
          else {
            return html`
              <button class="script" @click=${e => this.runScript(script, element.location)}>
                🚀${script}
              </button>
            `
          }
        }
        )}
      </div>
    `
  }

  _locationClicked(e) {
    this.openLocation(this.element.location)
  }

  openLocation(location) {
    client.mutate({
      mutation: gql`
        mutation($location: String!) {
          openLocation(location: $location)
        }
      `,
      variables: { location }
    })
  }

  runScript(script, location) {
    client.mutate({
      mutation: gql`
        mutation($script: String!, $location: String!) {
          runScript(script: $script, location: $location)
        }
      `,
      variables: { script, location }
    })
  }

  fetchOperations() {
    try {
      client.watchQuery({
        query: gql`
        query {
          operations {
            script
            location
          }
        }
      `,
      }).subscribe(({ data: { operations } }) => {
        this.operations = operations
      })
    } catch (error) {
    }
  }
}

customElements.define('wcfactory-ui-element', WCFactoryUIElement);