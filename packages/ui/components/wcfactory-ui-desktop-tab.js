import { LitElement, html, css } from 'lit-element';

class WCFactoryUIDesktopTab extends LitElement {
  static get properties() {
    return {
      active: { type: Boolean, reflect: true }
    }
  }

  constructor() {
    super()
    this.active = false
  }

  static get styles() {
    return css`
      :host {
        display: flex;
        width: 100vw;
        max-width: 300px;
        position: relative;
        align-items: flex-end;
        flex: 1 1 auto;
      }
      #container {
        width: 100%;
        background: var(--wcfactory-ui-secondary-color);
      }
      :host([active]) {
        max-width: 400px;
      }
      #header {
        font-size: .8em;
        padding: 1em;
      }
      :host([active]) #header {
        border-top: 1px solid var(--wcfactory-ui-accent-color);
      }
      #container #body {
        display: none;
      }
      #container[active="true"] #body {
        display: block;
      }
      wcfactory-ui-terminal {
        --wcfactory-ui-terminal-bg: calc(var(--wcfactory-ui-secondary-color) * 0.9);
      }
    `;
  } 

  render() {
    return html`
      <div id="container" active=${this.active} tabindex="1">
        <div id="header" @click=${() => this.active = !this.active}>
          <div id="header-left">
            <slot name="header"></slot>
          </div>
          <div id="header-right">
            <slot name="header-right"></slot>
          </div>
        </div>
        <div id="body"><slot></slot></div>
      </div>
    `;
  }
}

customElements.define('wcfactory-ui-desktop-tab', WCFactoryUIDesktopTab);