import { parse, print } from 'graphql/language'
import { writeToFile } from '../write-to-file'

const source = `
  query GetCheeseFiends {
    cheeseFiends {
      title
      last_name
      favorite_cheese
      favorite_wine
    }
  }

  mutation ElectCheeseLord($cheeseFiendId: ID!) {
    electCheeseLord(cheeseFiendId: $cheeseFiendId) {
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
    variables: def.variableDefinitions.map(
      (variable: any) => variable.variable.name.value
    ),
    operationString: print(def)
  }))

writeToFile(operations, __dirname, 'massaged.json')
