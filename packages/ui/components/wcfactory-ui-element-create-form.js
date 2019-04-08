import { LitElement, html } from 'lit-element';
import gql from 'graphql-tag'
import client from '../client.js'
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-checkbox/paper-checkbox.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/iron-form/iron-form.js';
import './wcfactory-ui-button.js'
import './wcfactory-ui-properties-form.js'

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
        pap
        .prop {
          margin: .5em;
        }
        #useSass {
          margin: 1em 0;
          display: flex;
          flex-direction: row-reverse;
          justify-content: flex-end;
          align-items: center;
        }
        #useSass label {
          margin: 0 .5em;
        }
        wcfactory-ui-properties-form {
          margin-top: -1em;
        }
      </style>

     <div id="wrapper">

        <div id="title">🏭 ${this.factory} create element</div>

        <iron-form id="form">
          <form>

            <h3>Name</h3>
            <paper-input always-float-label required label="Element name" auto-validate pattern="[a-z\-]*" @value-changed=${(e) => this.form = Object.assign({}, this.form, { name: e.detail.value})}></paper-input>

            <h3>Description</h3>
            <paper-input always-float-label required label="Description / purpose of the element"  @value-changed=${(e) => this.form = Object.assign({}, this.form, { description: e.detail.value})}></paper-input>

            <h3>Factory</h3>
            <paper-input always-float-label required label="Factory" disabled value=${this.factory}></paper-input>

            <h3>Library</h3>
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

            <h3>Use Sass (optional)</h3>
            <div id="useSass">
              <label for="useSass">Do you want to use Sass in this element?</label>
              <paper-checkbox
                id="useSass"
                @selected-changed=${e => this.form = Object.assign({}, this.form, { useSass: e.detail.value })}
              > </paper-checkbox>
            </div>

            <h3>Properties (optional)</h3>
            <div class="properties">
              <wcfactory-ui-properties-form
                @value-changed=${e => {
                  this.form = Object.assign({}, this.form, { propsList: e.detail })
                }}
              > </wcfactory-ui-properties-form>
            </div>


          <form>
       </iron-form>

        <div id="info">
          <div id="name"><h2>∈ ${this.form.name}</h2></div>
          <div id="repo-info">
            <div id="git-repo">
              <div>
                Description: ${this.form.description}
              </div>
              <div>
                Element Type: ${this.form.library}
              </div>
              ${this.form.propsList && this.form.propsList.length > 0
                ? html`
                  <div class="props">
                    Properties:
                    ${this.form.propsList.map(prop => {
                      if (prop.name || prop.description || prop.default) {
                        return html`
                          <div class="prop">
                            name: ${prop.name} <br>
                            description: ${prop.type} <br>
                            default: ${prop.default} <br>
                            observe: ${prop.observe ? 'yes' : 'no'} <br>
                          </div>
                        `
                      }
                      return 'none'
                    }
                    )}
                  </div>
                `
                : ''
              }
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