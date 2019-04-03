import { LitElement, html } from 'lit-element';
import '@polymer/paper-input/paper-input.js';
import '@polymer/iron-form/iron-form.js';
import './wcfactory-ui-button.js'

class WCFactoryUIElementCreateForm extends LitElement {
  static get properties() {
    return {
      form: { type: Object },
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
  }

  updated(changed) {
    if (
      false
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
        #title {
          width: 100%;
          margin-bottom: 2vw;
        }
      </style>

     <div id="wrapper">

        <div id="title">🏭 ${this.factory} create element</div>

        <iron-form id="form">
          <form>
            <paper-input always-float-label required label="name" auto-validate auto-validate pattern="[a-z\-]*" @value-changed=${(e) => this.form = Object.assign({}, this.form, { name: e.detail.value})}></paper-input>
            <paper-input always-float-label required label="factory" disabled value=${this.factory}></paper-input>
          <form>
        </iron-form>

        <div id="info">
          <div id="name"><h2>∈ ${this.humanName}</h2></div>
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

  _setValue() {
  }
}

customElements.define('wcfactory-ui-element-create-form', WCFactoryUIElementCreateForm);