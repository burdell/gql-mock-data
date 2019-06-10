import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools'
import { graphql } from 'graphql'
import { name } from 'faker'

import { writeToFile } from '../write-to-file'

export const typeDefs = `
  enum Wine {
    pinot_grigio
    merlot
    prosecco
    strawwberrry_wine
  }

  enum Cheese {
    muenster
    brie
    paneer
    cheez_whiz
  }

  type CheeseFiend {
    id: ID!
    title: String!
    last_name: String!
    favorite_wine: Wine!
    favorite_cheese: Cheese!
    times_won_cheeselord: Int!
  }

  type Query {
    cheeseFiends: [CheeseFiend!]!
  }

  type Mutation {
    electCheeseLord(cheeseFiendId: ID!): CheeseFiend!
  }

  schema {
    query: Query
    mutation: Mutation
  }
`

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

const schema = makeExecutableSchema({ typeDefs })
addMockFunctionsToSchema({
  schema,
  mocks: {
    CheeseFiend: () => ({
      title: name.prefix(),
      last_name: name.lastName()
    }),
    Query: () => ({
      cheeseFiends: () => [{}, {}, {}, {}]
    }),
    Int: () => {
      const min = Math.ceil(200)
      const max = Math.floor(0)
      return Math.floor(Math.random() * (max - min + 1)) + min
    }
  }
})

graphql({ schema, source, operationName: 'GetCheeseFiends' }).then(result =>
  writeToFile(result, __dirname, 'fiends.json')
)
graphql({
  schema,
  source,
  operationName: 'ElectCheeseLord',
  variableValues: { cheeseFiendId: '1' }
}).then(result => writeToFile(result, __dirname, 'cheeselord.json'))
