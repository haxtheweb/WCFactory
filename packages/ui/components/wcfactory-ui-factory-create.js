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
  render() {
    return html`
      <wcfactory-ui-factory-create-form @submit=${this._submitHandler}></wcfactory-ui-factory-create-form>
    `;
  }

  /**
   * Create a new factory and add it to the cache
   */
  _submitHandler(e) {
    client.mutate({
      mutation: CREATE_FACTORY_MUTATION,
      variables: { createFactoryInput: e.detail },
      update: (store, { data: { createFactory } }) => {
        const { id, __typename } = createFactory
        const query = GET_FACTORIES
        const cache = store.readQuery({ query })
        const factories = [...cache.factories, createFactory]
        store.writeQuery({ query, data: Object.assign({}, cache, { factories }) })
      }
    })
  }
}

customElements.define('wcfactory-ui-factory-create', WCFactoryUIFactoryCreate);