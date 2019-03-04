import { LitElement, html } from 'lit-element';
import gql from 'graphql-tag'
import client from '../client.js'

class WCFactoryUIElement extends LitElement {
  static get properties() {
    return {
      element: { type: Object } 
    }
  }

  constructor() {
    super()
    this.element = {}
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
        #header {
          display: flex;
        }
        #title {
          flex: 1 1 auto;
        }
        #middle {
          flex: 1 1 auto;
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
      <div id="middle"></div>
      <div id="footer">
        <button id="location" @click=${this._locationClicked}>📁${this.element.location} </button>
      </div>
    `;
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
}

customElements.define('wcfactory-ui-element', WCFactoryUIElement);