import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools'
import { graphql } from 'graphql'
import * as faker from 'faker'

import { writeToFile } from '../write-to-file'

/*** SCHEMA */
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

  type CheeseFan {
    id: ID!
    title: String!
    last_name: String!
    favorite_wine: Wine!
    favorite_cheese: Cheese!
    times_won_cheeselord: Int!
  }

  type Query {
    cheeseFans: [CheeseFan!]!
  }

  type Mutation {
    electCheeseLord(cheeseFanId: ID!): CheeseFan!
  }

  schema {
    query: Query
    mutation: Mutation
  }
`

/** OPERATIONS */
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

const schema = makeExecutableSchema({ typeDefs })
addMockFunctionsToSchema({
  schema,
  mocks: {
    CheeseFan: () => ({
      title: faker.name.prefix(),
      last_name: faker.name.lastName()
    }),
    Query: () => ({
      cheeseFans: () => [{ title: 'Darth' }, {}, {}, {}, {}]
    }),
    Int: () => {
      const min = Math.ceil(200)
      const max = Math.floor(0)
      return Math.floor(Math.random() * (max - min + 1)) + min
    }
  }
})

graphql({ schema, source, operationName: 'GetCheeseFans' }).then(result =>
  writeToFile(result, __dirname, 'fans.json')
)
graphql({
  schema,
  source,
  operationName: 'ElectCheeseLord',
  variableValues: { cheeseFanId: '1' }
}).then(result => writeToFile(result, __dirname, 'cheeselord.json'))
