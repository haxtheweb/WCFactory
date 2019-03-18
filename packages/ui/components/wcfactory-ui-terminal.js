import { LitElement, html } from 'lit-element';

class WCFactoryUITerminal extends LitElement {

  firstUpdated() {
    // store output target
    this._outputElement = this.shadowRoot.querySelector('#output')
    // watch for changes to content and update scroll
    this.shadowRoot.addEventListener('slotchange', this._slotChangeHandler.bind(this))
  }

  disconnectedCallback() {
    this.shadowRoot.removeEventListener('slotchange', this._slotChangeHandler.bind(this))
  }

  /**
   * Scroll ouput element to the bottom
   */
  _slotChangeHandler() {
    this._outputElement.scrollTop = this._outputElement.scrollHeight
  }

  render() {
    return html`
      <style>
        :host {
          display: block;
        }

        #output {
          background: black;
          height: 150px;
          overflow-x: hidden;
          overflow-y: scroll;
          font-size: 10px;
          padding: 5px;
        }
      </style>
      <div id="output">
        <slot></slot>
      </div>
    `;  
  }
}

customElements.define('wcfactory-ui-terminal', WCFactoryUITerminal);