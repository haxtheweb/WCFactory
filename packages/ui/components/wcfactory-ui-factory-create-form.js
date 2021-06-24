import { LitElement, html } from "lit";
import '@polymer/paper-input/paper-input.js';
import '@polymer/iron-form/iron-form.js';
import './wcfactory-ui-button.js'

class WCFactoryUIFactoryCreateForm extends LitElement {
  static get properties() {
    return {
      form: { type: Object },
      name: { type: String },
      humanName: { type: String },
      description: { type: String },
      orgGit: { type: String },
      orgNpm: { type: String },
      gitRepo: { type: String },
      isValid: { type: Boolean },
      loading: { type: Boolean, reflect: true },
    }
  }

  constructor() {
    super()
    this.isValid = false
    this.name = ''
    this.humanName = ''
    this.description = ''
    this.orgGit = ''
    this.orgNpm = ''
    this.gitRepo = ''
    this.loading = false
  }

  updated(changed) {
    if (
      this.name !== '' &&
      this.humanName !== '' &&
      this.description !== '' &&
      this.orgGit !== '' &&
      this.orgNpm !== ''
    ) {
      const valid = this._validateForm()
    }
    this.gitRepo = `git:github.com/${this.orgGit ? this.orgGit : '<org name>'}/${this.name ? this.name : '<name>'}`
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
          margin-top: 1vw;
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
      </style>
      <div id="wrapper">
        <iron-form id="form">
          <form>
            <paper-input always-float-label required label="name" auto-validate auto-validate pattern="[a-z\-]*" @value-changed=${(e) => this.name = e.detail.value}></paper-input>
            <paper-input always-float-label required label="human name" auto-validate auto-validate @value-changed=${(e) => this.humanName = e.detail.value}></paper-input>
            <paper-input always-float-label required label="description" @value-changed=${(e) => this.description = e.detail.value}></paper-input>
            <paper-input always-float-label required label="orgGit" auto-validate pattern="[a-z\-]*" @value-changed=${(e) => this.orgGit = e.detail.value}></paper-input>
            <paper-input always-float-label required label="orgNpm" auto-validate pattern="[a-z\-]*" @value-changed=${(e) => this.orgNpm = e.detail.value}></paper-input>
          <form>
        </iron-form>

        <div id="info">
          <div id="name"><h2>🏭 ${this.humanName}</h2></div>
          <div id="repo-info">
            <div id="git-repo">
              Git Repo: <br>
              ${this.gitRepo}
            </div>
            <div id="npm-repo" ?data-filled=${this.orgNpm}>
              NPM Repo: <br>
              @${this.orgNpm ? `${this.orgNpm}` : ''}
            </div>
          </div>
        </div>
      </div>

      <div id="create">
        <wcfactory-ui-button @click=${() => this._submit()} .disabled=${!this.isValid} cta >Create Factory</wcfactory-ui-button>
      </div>

      ${this.loading
        ? html`<div id="loading">...Creating Factory</div>`
        : ''
      }
    `;
  }

  _submit() {
    const valid = this._validateForm()
    if (valid) {
      this.dispatchEvent(new CustomEvent('submit', {
        bubbles: true,
        detail: {
          name: this.name,
          humanName: this.humanName,
          description: this.description,
          orgGit: this.orgGit,
          orgNpm: `@${this.orgNpm}`,
          gitRepo: this.gitRepo
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