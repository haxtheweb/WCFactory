import { LitElement, html, css } from 'lit-element';
import '@polymer/paper-spinner/paper-spinner.js';

class WCFactoryUIFactoryState extends LitElement {
  static get properties() {
    return {
      output: { type: String },
    }
  }

  constructor() {
    super()
    this.output = ''
  }

  static get styles() {
    return css`
      :host {
        --wcfactory-ui-factory-state-spinner-scale: 0.5;
        display: flex;
      }
      paper-spinner {
        transform: scale(var(--wcfactory-ui-factory-state-spinner-scale));
        --paper-spinner-stroke-width: 3px;
      }
    `;
  } 

  render() {
    if (this.output) {
      return html`<paper-spinner active></paper-spinner>${this.output}`
    }
    else {
      return html`
        complete
      `
    }
  }
}

customElements.define('wcfactory-ui-factory-state', WCFactoryUIFactoryState);