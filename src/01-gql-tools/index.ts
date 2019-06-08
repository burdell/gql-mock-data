import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools'
import { graphql } from 'graphql'
import { name } from 'faker'

import { writeToFile } from '../write-to-file'

export const typeDefs = `
  enum School {
    georgia_tech
    uga
    hogwarts
  }

  enum Meme {
    blinking_white_guy
    arthur_clenching_hand
    is_this_butterfly
  }

  type Person {
    first_name: String
    last_name: String
    school: School
    favorite_meme: Meme
    times_won_memelord: Int
  }

  type Query {
    friendsList: [Person!]!
  }

  type Mutation {
    electMemeLord(memeLord: String): Person!
  }

  schema {
    query: Query
    mutation: Mutation
  }
`

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
addMockFunctionsToSchema({
  schema,
  mocks: {
    Person: () => ({
      first_name: name.firstName(),
      last_name: name.lastName()
    }),
    Int: () => {
      const min = Math.ceil(200)
      const max = Math.floor(0)
      return Math.floor(Math.random() * (max - min + 1)) + min
    }
  }
})

graphql({ schema, source, operationName: 'GetFriends' }).then(result =>
  writeToFile(result, __dirname, 'friends.json')
)
graphql({
  schema,
  source,
  operationName: 'ElectMemeLord',
  variableValues: { memeLord: '1' }
}).then(result => writeToFile(result, __dirname, 'memelord.json'))
