import { LitElement, html } from "lit";
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-checkbox/paper-checkbox.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/iron-form/iron-form.js';
import './wcfactory-ui-button.js'

class WCFactoryUIPropertyForm extends LitElement {
  static get properties() {
    return {
      value: { type: Object }
    }
  }

  constructor() {
    super()
    this.value = {}
    this.propertyTypes = [
      {
        value: 'Boolean',
        description: 'Boolean, true/false value',
      },
      {
        value: 'Number',
        description: 'Number, number like 54',
      },
      {
        value: 'Object',
        description: 'Object, complex item storing multiple types',
      },
      {
        value: 'Array',
        description: 'Array, list of types',
      }
    ]
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
      </style>
      <paper-input label="Property name: example 'title'" required @value-changed=${e => this.value = Object.assign({}, this.value, { name: e.detail.value })}></paper-input>

      <paper-dropdown-menu label="Property type" required>
        <paper-listbox slot="dropdown-content" @selected-changed=${e => this.value = Object.assign({}, this.value, { type: this.propertyTypes[e.detail.value].value})}>
          ${this.propertyTypes.map(type =>
            html`<paper-item>${type.description}</paper-item>`
          )}
        </paper-listbox>
      </paper-dropdown-menu>

      <paper-input
        label="Default value (optional)"
        @value-changed=${e => this.value = Object.assign({}, this.value, { default: e.detail.value })}
      > </paper-input>

      <div id="observe-prop">
        <label for="observe">Do you want to use Sass in this element?</label>
        <paper-checkbox
          id="observe"
          @selected-changed=${e => {
            console.log(e)
          }}
        > </paper-checkbox>
      </div>
    `
  }
}

customElements.define('wcfactory-ui-property-form', WCFactoryUIPropertyForm);