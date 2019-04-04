import { LitElement, html } from 'lit-element';
import gql from 'graphql-tag'
import client from '../client.js'
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/iron-form/iron-form.js';
import './wcfactory-ui-button.js'

class WCFactoryUIElementCreateForm extends LitElement {
  static get properties() {
    return {
      form: { type: Object },
      formOptions: { type: Object },
      isValid: { type: Boolean },
      loading: { type: Boolean, reflect: true },
      factory: { type: String }
    }
  }

  constructor() {
    super()
    this.title = ''
    this.isValid = false
    this.loading = false
    this.form = {
      name: ''
    }
    this._getFormOptions()
 }

  updated(changed) {
    if (
      this.form.name &&
      this.form.description &&
      this.form.library
    ) {
      const valid = this._validateForm()
    }
  }

  render () {
    return html`
      <style>
        :host {
          display: block;
          position: relative;
        }
        #footer {
          margin-top: 5vw;
        }
        #repo-info {
          display: flex;
          justify-content: space-between;
        }
        #wrapper {
          background-color: white;
          padding: 1vw;
          color: #333;
        }
        #info {
          margin-top: 5vw;
        }
        #loading {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: rgba(255,255,255,0.7);
          color: black;
        }
        #title {
          width: 100%;
          margin-bottom: 2vw;
        }
        paper-dropdown-menu {
          width: 100%;
        }
      </style>

     <div id="wrapper">

        <div id="title">🏭 ${this.factory} create element</div>

        <iron-form id="form">
          <form>
            <paper-input always-float-label required label="name" auto-validate pattern="[a-z\-]*" @value-changed=${(e) => this.form = Object.assign({}, this.form, { name: e.detail.value})}></paper-input>
            <paper-input always-float-label required label="description"  @value-changed=${(e) => this.form = Object.assign({}, this.form, { description: e.detail.value})}></paper-input>
            <paper-input always-float-label required label="factory" disabled value=${this.factory}></paper-input>
            ${this.formOptions
              ? html`
                <paper-dropdown-menu label="Library" required>
                  <paper-listbox slot="dropdown-content" @selected-changed=${e => this.form = Object.assign({}, this.form, { library: this.formOptions.libraries[e.detail.value].name})}>
                    ${this.formOptions.libraries.map(library =>
                      html`<paper-item>${library.description}</paper-item>`
                    )}
                  </paper-listbox>
                </paper-dropdown-menu>
              `
              : ''
            }
          <form>
        </iron-form>

        <div id="info">
          <div id="name"><h2>∈ ${this.form.name}</h2></div>
          <div id="repo-info">
            <div id="git-repo">
              <div>
                Description: ${this.form.description}
              </div>
              Element Type: ${this.form.library}
            </div>
          </div>
        </div>
      </div>

      <div id="create">
        <wcfactory-ui-button @click=${() => this._submit()} .disabled=${!this.isValid} cta >Create Element</wcfactory-ui-button>
      </div>

      ${this.loading
        ? html`<div id="loading">...Creating Element</div>`
        : ''
      }
    `;
  }

  _submit() {
    const valid = this._validateForm()
    if (valid) {

    }
  }
 
  _validateForm() {
    const form = this.shadowRoot.querySelector('#form')
    const valid = form.validate()
    this.isValid = valid
    return valid
  }

  _getFormOptions() {
    client.watchQuery({
      query: gql`
        query {
          elementCreateOptions {
            libraries {
              name
              description
            }
          }
        }
      `
    }).subscribe(({ data: { elementCreateOptions } }) => {
      this.formOptions = elementCreateOptions
    })
  }

}

customElements.define('wcfactory-ui-element-create-form', WCFactoryUIElementCreateForm);