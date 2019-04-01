import { LitElement, html } from 'lit-element';
import '@polymer/paper-input/paper-input.js';
import '@polymer/iron-form/iron-form.js';
import './wcfactory-ui-button.js'
import validate from 'is-valid-element-name';
import 'lit-apollo/elements/apollo-mutation-element.js';

class WCFactoryUIFactoryCreate extends LitElement {
  static get properties() {
    return {
      form: { type: Object },
      name: { type: String },
      description: { type: String },
      gitOrg: { type: String },
      npmOrg: { type: String },
      isValid: { type: Boolean },
      loading: { type: Boolean }
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
      this._validateForm()
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
            <paper-input always-float-label required label="name" auto-validate pattern="^[a-z](?:[\-\.0-9_a-z\xB7\xC0-\xD6\xD8-\xF6\xF8-\u037D\u037F-\u1FFF\u200C\u200D\u203F\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]|[\uD800-\uDB7F][\uDC00-\uDFFF])*-(?:[\-\.0-9_a-z\xB7\xC0-\xD6\xD8-\xF6\xF8-\u037D\u037F-\u1FFF\u200C\u200D\u203F\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]|[\uD800-\uDB7F][\uDC00-\uDFFF])*$" @value-changed=${(e) => this.name = e.detail.value}></paper-input>
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

      <div id="create" >
        <wcfactory-ui-button @click=${() => this._validateForm()} .disabled=${!this.isValid}>Create Factory</wcfactory-ui-button>
      </div>

    `;
  }
  
  _validateForm() {
    const form = this.shadowRoot.querySelector('#form')
    const valid = form.validate()
    this.isValid = valid
  }

}

customElements.define('wcfactory-ui-factory-create', WCFactoryUIFactoryCreate);
      // <script type="application/graphql">
      //   mutation ($id: ID!)
      //     user(id: $id) {
      //       name
      //       picture
      //     }
      //   }
      // </script>