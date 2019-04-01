// import { LitElement, html } from 'lit-element';
import { ApolloMutation, html } from 'lit-apollo';
import gql from 'graphql-tag'
import 'lit-apollo/elements/apollo-mutation-element.js';
import client from '../client.js'
import './wcfactory-ui-factory-create-form.js'

export const CREATE_FACTORY_MUTATION = gql`
  mutation($createFactoryInput: CreateFactoryInput!) {
    createFactory(createFactoryInput: $createFactoryInput)
  }
`

export class WCFactoryUIFactoryCreate extends ApolloMutation {
  render() {
    this.client = client
    this.mutation = CREATE_FACTORY_MUTATION
    return html`
      <wcfactory-ui-factory-create-form @submit=${this._submitHandler}></wcfactory-ui-factory-create-form>
    `;
  }

  _submitHandler(e) {
    this.variables = Object.assign({}, { createFactoryInput: e.detail })
    this.mutate()
  }
}

customElements.define('wcfactory-ui-factory-create', WCFactoryUIFactoryCreate);