import { visit, print } from 'graphql'
import { GatherGQLOperation } from './types'

export function getOperations(documents: any[]) {
  let operations: GatherGQLOperation[] = []
  documents.forEach(document => {
    const operation = document.content.definitions
      .filter((def: any) => def.kind === 'OperationDefinition')
      .map((def: any) => ({
        name: def.name.value,
        variables: def.variableDefinitions.map((variable: any) => ({
          name: variable.variable.name.value,
          type: getVariableType(variable)
        })),
        operationString: print(def)
      }))
      .map((def: any) => def)

    operations = operations.concat(operation)
  })

  return operations
}

function getVariableType(variable: any) {
  let variableType: string | null = null
  visit(variable, {
    enter(node: any) {
      if (node.type && node.type.name) {
        variableType = node.type.name.value
      }
      return
    },
    leave() {
      return
    }
  })

  return variableType
}
