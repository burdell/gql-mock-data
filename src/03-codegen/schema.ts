import { buildSchema } from 'graphql'

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

export const schema = buildSchema(typeDefs)
