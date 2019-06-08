import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools'
import { graphql } from 'graphql'

import { typeDefs } from './typeDefs'
import { writeToFile } from '../write-to-file'
import { mocks } from './mocks'

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

const schema = makeExecutableSchema({ typeDefs })
addMockFunctionsToSchema({ schema, mocks })

graphql({ schema, source, operationName: 'GetFriends' }).then(result =>
  writeToFile(result, __dirname, 'friends.json')
)
graphql({
  schema,
  source,
  operationName: 'ElectMemeLord',
  variableValues: { memeLord: '1' }
}).then(result => writeToFile(result, __dirname, 'memelord.json'))
