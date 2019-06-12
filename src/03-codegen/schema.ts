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

  type Pairing {
    cheese: Cheese
    wine: Wine
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
    pairing: Pairing!
  }

  type Mutation {
    electCheeseLord(cheeseFanId: ID!): CheeseFan!
  }

  schema {
    query: Query
    mutation: Mutation
  }
`

export const schema = buildSchema(typeDefs)
