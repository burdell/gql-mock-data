import { GraphQLSchema, graphql } from 'graphql'
import { Types, PluginFunction } from '@graphql-codegen/plugin-helpers'

import { GatherMockedData } from './types'
import { mockSchema, addMocks } from './schema'
import { OperationConfig } from './operation-config'
import { getOperations } from './operations'

export const plugin: PluginFunction = async (
  schema: GraphQLSchema,
  documents: Types.DocumentFile[]
) => {
  const mockedSchema = mockSchema(schema)
  const operations = getOperations(documents)
  const mockData: GatherMockedData = {}

  await asyncForEach(operations, async operation => {
    const operationConfig = OperationConfig[operation.name] || {}
    const operationInput = operationConfig.input

    addMocks(mockedSchema, operationConfig.mocks)

    if (operation.variables.length === 0 || operationInput) {
      const result = await graphql({
        schema: mockedSchema,
        source: operation.operationString,
        variableValues: operationInput
      })
      mockData[operation.name] = result.data
    }
  })

  return generateTSFile(mockData)
  // return JSON.stringify(documents)
}

async function asyncForEach<T>(
  array: Array<T>,
  callback: (t: T, i: number, a: T[]) => void
) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}

function generateTSFile(things: GatherMockedData) {
  let file = '// 🤖 THIS IS A GENERATED FILE 🤖 \n\n\n\n\n'

  const thingNames = Object.keys(things)
  thingNames.forEach(thingName => {
    const thing = things[thingName]
    const tsString = `export const ${thingName} = ${JSON.stringify(thing)};`
    file = file + `${tsString}\n\n`
  })

  return file
}
