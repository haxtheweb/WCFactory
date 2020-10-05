import client from '../client.js'
import gql from 'graphql-tag'
import { GET_OPERATIONS } from '../components/wcfactory-ui-script.js';
import { GET_OPERATION_OUTPUT } from '../components/wcfactory-ui-active-script.js';

const SUBSCRIBE_OPERATIONS_OUTPUT = gql`
  subscription {
    operationsOutput
  }
`

export const subscribeToOperationsOutput = () => {
  client.subscribe({
    query: SUBSCRIBE_OPERATIONS_OUTPUT
  }).subscribe(({ data: { operationsOutput } }) => {
    let operationsOutputData = JSON.parse(operationsOutput)
    try {
      // get the existing query
      const data = client.readQuery({ query: GET_OPERATION_OUTPUT, variables: { pid: operationsOutputData.operation } })
      // convert the pid ref into an object ref, i have to do this because I'm doing the subscription incorrectly
      // on the server.
      const operationRef = Object.assign({}, { operation: { pid: operationsOutputData.operation, __typename: 'Operation' }})
      // create a new array of operation output
      const operationOutput = [...data.operationOutput, Object.assign({}, operationsOutputData, operationRef)]
      // update the cache
      client.writeQuery({
        query: GET_OPERATION_OUTPUT,
        variables: { pid: operationsOutputData.operation },
        data: Object.assign({}, data, { operationOutput })
      })
    }
    catch(error) {
      client.writeQuery({
        query: GET_OPERATION_OUTPUT,
        variables: { pid: operationsOutputData.operation },
        data: Object.assign({}, { data: { operationsOutput: [operationsOutputData] }})
      })
    }
  })
}