import { LitElement, html } from 'lit-element';
import gql from 'graphql-tag'

class WCFactoryUIList extends LitElement {
  static get properties() {
    return {
      url: { type: String }
    }
  }

  render() {
    return html`
      <style>
        :host {
          display: block;
        }
        #list {
          display: flex;
          flex-direction: column;
        }
        #list-item {
          display: flex;
          padding: 10px;
          color: inherit;
          text-decoration: none;
        }
        #list-item:hover, #list-item:focus {
          background: rgba(255,255,255, 0.1);
        }
        #item-title {
          flex: 1 1 auto;
          margin: 0;
          font-size: 18px;
        }
        #item-desc {
          opacity: 0.7;
        }
      </style>
      <div id="list">
        <a id="list-item" href="${this.url}">
          <h2 id="item-title"> <slot name="title"></slot> </h2>
          <div id="item-desc"> <slot name="desc"></slot> </div>
        </a>
      </div>
    `;
  }
}

customElements.define('wcfactory-ui-list', WCFactoryUIList);