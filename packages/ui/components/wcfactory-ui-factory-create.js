import { LitElement, html } from 'lit-element';
// import { ApolloMutation, html } from 'lit-apollo'
import gql from 'graphql-tag'
import client from '../client.js'
import './wcfactory-ui-factory-create-form.js'
import { FACTORY_FRAGMENT, GET_FACTORIES } from './wcfactory-ui-factories'

export const CREATE_FACTORY_MUTATION = gql`
  mutation($createFactoryInput: CreateFactoryInput!) {
    createFactory(createFactoryInput: $createFactoryInput) {
      ...FactoryInfo
    }
  }
  ${FACTORY_FRAGMENT}
`

export class WCFactoryUIFactoryCreate extends LitElement {
  static get properties() {
    return {
      loading: { type: Boolean }
    }
  }

  render() {
    return html`
      <wcfactory-ui-factory-create-form @submit=${this._submitHandler} .loading=${this.loading}></wcfactory-ui-factory-create-form>
      <a id="return-home" href="/" hidden></a>
    `;
  }

  /**
   * Create a new factory and add it to the cache
   */
  _submitHandler(e) {
    this.loading = true;
    client.mutate({
      mutation: CREATE_FACTORY_MUTATION,
      variables: { createFactoryInput: e.detail },
      update: (store, { data: { createFactory } }) => {
        const { id, __typename } = createFactory
        const query = GET_FACTORIES
        const cache = store.readQuery({ query })
        const factories = [...cache.factories, createFactory]
        store.writeQuery({ query, data: Object.assign({}, cache, { factories }) })
        setTimeout(() => {
          this.loading = false;
          this.shadowRoot.querySelector('#return-home').click()
        }, 1000)
      }
    })
  }
}

customElements.define('wcfactory-ui-factory-create', WCFactoryUIFactoryCreate);