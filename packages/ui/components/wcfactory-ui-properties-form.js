import { LitElement, html } from 'lit-element';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-checkbox/paper-checkbox.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/iron-form/iron-form.js';
import './wcfactory-ui-button.js'
import './wcfactory-ui-property-form.js'

class WCFactoryUIPropertiesForm extends LitElement {
  static get properties() {
    return {
      value: { type: Array }
    }
  }

  constructor() {
    super()
    this.value = [{
      name: '',
      type: '',
      default: ''
    }]
  }

  updated(changed) {
    for (let changes of changed) {
      changes.forEach(change => {
        if (change === 'value') {
          this.dispatchEvent(new CustomEvent('value-changed', {
            detail: this.value
          }))
        }
      });
    }
  }

  render () {
    return html`
      <style>
        :host {
          display: block;
          position: relative;
        }
        wcfactory-ui-property-form {
          padding: .5em;
          margin: .5em;
        }
      </style>
      ${this.value.map((item, key) => 
        html`
          <wcfactory-ui-property-form
            @value-changed=${e => {
              let value = [...this.value]
              value[key] = e.detail
              this.value = value
            }}
          ></wcfactory-ui-property-form>
        `
      )}
      <paper-button
        @click=${e => this.value = [...this.value, {}]}
      > Add property➕</paper-button>
    `
  }
}

customElements.define('wcfactory-ui-properties-form', WCFactoryUIPropertiesForm);