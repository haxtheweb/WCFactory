import { LitElement, html } from 'lit-element';

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
        }
      </style>
      <div id="header">
        <div id="title"> ${this.element.name} </div>
        <div id="version"> 📦${this.element.version} </div>
      </div>
      <div id="middle"></div>
      <div id="footer">
        <div id="location">📁${this.element.location} </div>
      </div>
    `;
  }
}

customElements.define('wcfactory-ui-element', WCFactoryUIElement);