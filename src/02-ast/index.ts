import { parse, print } from 'graphql/language'
import { writeToFile } from '../write-to-file'

const source = `
  query GetFriends {
    friendsList {
      first_name
      last_name
      school
    }
  }

  mutation ElectMemeLord($memeLord: String) {
    electMemeLord(memeLord: $memeLord) {
      first_name
      last_name
      favorite_meme
      times_won_memelord
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
