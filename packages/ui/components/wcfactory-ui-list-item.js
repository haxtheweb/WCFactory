import { LitElement, html } from "lit";

class WCFactoryUIListItem extends LitElement {
  static get properties() {
    return {
      url: { type: String },
      title: { type: String }
    }
  }

  constructor() {
    super()
  }

  render() {
    return html`
      <style>
        :host {
          display: block;
        }
        #list-item {
          display: flex;
          padding: 10px;
          color: inherit;
          text-decoration: none;
        }
        #list-item:hover, #list-item:focus {
          background: --list-item-hover-background;
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
      <div id="list-item">
        <h2 id="item-title"> ${this.title} </h2>
        <div id="item-desc"> <slot></slot> </div>
      </div>
    `;
  }
}

customElements.define('wcfactory-ui-list-item', WCFactoryUIListItem);