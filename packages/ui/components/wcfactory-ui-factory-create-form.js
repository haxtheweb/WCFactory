import { LitElement, html } from 'lit-element';
import '@polymer/paper-input/paper-input.js';
import '@polymer/iron-form/iron-form.js';
import './wcfactory-ui-button.js'

class WCFactoryUIFactoryCreateForm extends LitElement {
  static get properties() {
    return {
      form: { type: Object },
      name: { type: String },
      description: { type: String },
      gitOrg: { type: String },
      npmOrg: { type: String },
      isValid: { type: Boolean },
    }
  }

  constructor() {
    super()
    this.isValid = false
    this.name = ''
    this.description = ''
    this.gitOrg = ''
    this.npmOrg = ''
  }

  updated(changed) {
    if (
      this.name !== '' &&
      this.description !== '' &&
      this.gitOrg !== '' &&
      this.npmOrg !== ''
    ) {
      const valid = this._validateForm()
    }
  }

  render () {
    return html`
      <style>
        :host {
          display: block;
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
          margin-top: 1vw;
        }
      </style>
      <div id="wrapper">
        <iron-form id="form">
          <form>
            <paper-input always-float-label required label="name" auto-validate auto-validate pattern="[a-z\-]*" @value-changed=${(e) => this.name = e.detail.value}></paper-input>
            <paper-input always-float-label required label="description" @value-changed=${(e) => this.description = e.detail.value}></paper-input>
            <paper-input always-float-label required label="gitOrg" auto-validate pattern="[a-z\-]*" @value-changed=${(e) => this.gitOrg = e.detail.value}></paper-input>
            <paper-input always-float-label required label="npmOrg" auto-validate pattern="[a-z\-]*" @value-changed=${(e) => this.npmOrg = e.detail.value}></paper-input>
          <form>
        </iron-form>

        <div id="info">
          <div id="name"><h2>🏭 ${this.name}</h2></div>
          <div id="repo-info">
            <div id="git-repo">
              Git Repo: <br>
              git:github.com/${this.gitOrg ? this.gitOrg : '<git org>'}/${this.name ? this.name : '<name>'}
            </div>
            <div id="npm-repo" ?data-filled=${this.npmOrg}>
              NPM Repo: <br>
              @${this.npmOrg ? `${this.npmOrg}` : ''}
            </div>
          </div>
        </div>
      </div>

      <div id="create">
        <wcfactory-ui-button @click=${() => this._submit()} .disabled=${!this.isValid} cta >Create Factory</wcfactory-ui-button>
      </div>
    `;
  }

  _submit() {
    const valid = this._validateForm()
    if (valid) {
      this.dispatchEvent(new CustomEvent('submit', {
        bubbles: true,
        detail: {
          name: this.name,
          description: this.description,
          gitOrg: this.gitOrg,
          npmOrg: this.npmOrg,
        }
      }))
    }
  }
  
  _validateForm() {
    const form = this.shadowRoot.querySelector('#form')
    const valid = form.validate()
    this.isValid = valid
    return valid
  }
}

customElements.define('wcfactory-ui-factory-create-form', WCFactoryUIFactoryCreateForm);