import { parse, print, visit } from 'graphql/language'
import { writeToFile } from '../write-to-file'

const source = `
query GetCheeseFans {
  cheeseFans {
    title
    last_name
    favorite_cheese
    favorite_wine
  }
}

mutation ElectCheeseLord($cheeseFanId: ID!) {
  electCheeseLord(cheeseFanId: $cheeseFanId) {
    title
    last_name      
    times_won_cheeselord
  }
}
`

const ast = parse(source)
writeToFile(ast, __dirname, 'ast.json')

const operations = ast.definitions
  .filter(def => def.kind === 'OperationDefinition')
  .map((def: any) => ({
    name: def.name.value,
    variables: def.variableDefinitions.map((variable: any) => ({
      name: variable.variable.name.value,
      type: getVariableType(variable)
    })),
    operationString: print(def)
  }))

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

writeToFile(operations, __dirname, 'massaged.json')
