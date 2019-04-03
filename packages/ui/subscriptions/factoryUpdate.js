import client from '../client.js'
import gql from 'graphql-tag'
import { FACTORY_FRAGMENT } from '../components/wcfactory-ui-factories'

export const SUBSCRIBE_FACTORY_UPDATE = gql`
  subscription {
    factoryUpdate
  }
`

export const subscribeToFactoryUpdates = () => {
  client.subscribe({
    query: SUBSCRIBE_FACTORY_UPDATE
  }).subscribe(({ data: { factoryUpdate } }) => {
    let factoryUpdateData = JSON.parse(factoryUpdate)
    try {
      const id = `${factoryUpdateData.__typename}:${factoryUpdateData.id}`
      const fragment = FACTORY_FRAGMENT
      const cache = client.readFragment({ fragment, id })
      const data = Object.assign({}, cache, { output: factoryUpdateData.output })
      client.writeFragment({ fragment, id, data })
    } catch (err) {
      console.log(err)
    }
  })
}