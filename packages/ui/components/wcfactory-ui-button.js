import { LitElement, html } from 'lit-element';
import '@polymer/paper-button/paper-button.js';

class WCFactoryUIButton extends LitElement {
  static get properties() {
    return {
      disabled: { type: Boolean, reflect: true },
      cta: { type: Boolean, reflect: true }
    }
  }

  constructor() {
    super()
    this.disabled = false
    this.cta = false
  }

  render() {
    return html`
      <style>
      :host {
        --wcfactory-ui-button-bg-color: #2C3E50;
        --wcfactory-ui-button-color: #15B5E2;
        display: block;
      }
      :host([disabled=""]) {
        opacity: 0.2;
      }
      .btn-wrapper {
        height: 110px;
        width: calc(100% - 2.1em);
        position: relative;
        display: block;
        padding: 0;
        margin: 0;
        margin-top: 20px;
        margin-left: 1.05em;
      }
      :host(:not([disabled=""])) .btn-wrapper:focus .btn-inner,
      :host(:not([disabled=""])) .btn-wrapper:hover .btn-inner {
        top: -4px;
        transform: scale(1, 1);
        cursor: pointer;
      }
      .btn-wrapper__container {
        border-bottom: 2px solid var(--wcfactory-ui-button-color);
        position: absolute;
        width: 100%;
        height: 80px;
      }
      .btn-wrapper__container:before,
      .btn-wrapper__container:after {
        border-bottom: 2px solid var(--wcfactory-ui-button-color);
        width: 96%;
        left: 2%;
        bottom: -8px;
        content: "";
        position: absolute;
      }
      .btn-wrapper__container:after {
        width: 92%;
        left: 4%;
        bottom: -14px;
      }
      .btn-wrapper__container .btn-inner {
        width: 104.2%;
        height: 100%;
        position: absolute;
        top: 20px;
        left: -2.1%;
        border: 2px solid var(--wcfactory-ui-button-color);
        box-sizing: border-box;
        display: flex;
        justify-content: center;
        align-items: center;
        letter-spacing: 1px;
        text-transform: uppercase;
        font-size: 18px;
        background: var(--wcfactory-ui-button-bg-color);
        transform: scale(0.96, 0.96);
        transition: all .3s;
        z-index: 4;
      }
      .btn-wrapper__container .btn-inner__text {
        text-decoration: none;
        color: var(--wcfactory-ui-button-color);
      }
      </style>
      <paper-button class="btn-wrapper" .disabled=${this.disabled}>
        <div class="btn-wrapper__container">
          <div class="btn-inner">
            <div class="btn-inner__text"><slot></slot></div>
          </div>
        </div>
      </paper-button>
    `;
  }

}

customElements.define('wcfactory-ui-button', WCFactoryUIButton);