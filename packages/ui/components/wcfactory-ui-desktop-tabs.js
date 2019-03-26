import { LitElement, html, css } from 'lit-element';
import './wcfactory-ui-desktop-tab.js'

class WCFactoryUIDesktopTabs extends LitElement {
  static get properties() {
    return {
    }
  }

  constructor() {
    super()
  }

  static get styles() {
    return css`
      :host {
        display: flex;
        position: fixed;
        right: 0;
        bottom: 0;
        z-index: 100;
      }
      #tabs {
        display: flex;
      }
      #container {
        display: flex;
      }
    `;
  } 

  render() {
    return html`
      <div id="tabs">
        <div id="container">
          <slot></slot>
        </div>
      </div>
    `;
  }
}

customElements.define('wcfactory-ui-desktop-tabs', WCFactoryUIDesktopTabs);