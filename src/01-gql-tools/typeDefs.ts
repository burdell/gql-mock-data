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
