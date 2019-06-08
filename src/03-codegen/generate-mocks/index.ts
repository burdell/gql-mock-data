import { GraphQLSchema, print, graphql } from 'graphql'
import { Types, PluginFunction } from '@graphql-codegen/plugin-helpers'

import { GatherGQLOperation, GatherMockedData } from './types'
import { mockSchema } from './schema'
import { OperationConfig } from './operation-config'

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
}

function getOperations(documents: Types.DocumentFile[]) {
  let operations: GatherGQLOperation[] = []
  documents.forEach(document => {
    const operation = document.content.definitions
      .filter(def => def.kind === 'OperationDefinition')
      .map((def: any) => ({
        name: def.name.value,
        variables: def.variableDefinitions.map(
          (variable: any) => variable.variable.name.value
        ),
        operationString: print(def)
      }))
      .map(def => def)

    operations = operations.concat(operation)
  })

  return operations
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
  thingNames.forEach((thingName, i) => {
    const thing = things[thingName]
    const tsString = `export const ${thingName} = ${JSON.stringify(thing)};`
    file = file + `${tsString}\n\n`
  })

  return file
}
