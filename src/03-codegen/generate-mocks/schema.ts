import { graphql, GraphQLArgs, GraphQLSchema } from 'graphql'
import { printSchema } from 'graphql/utilities/schemaPrinter'
import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools'

import { globalMocks } from './global-mocks'

export function mockSchema(schema: GraphQLSchema, mocks = {}) {
  const mockedSchema = makeExecutableSchema({ typeDefs: printSchema(schema) })
  addMockFunctionsToSchema({
    schema: mockedSchema,
    mocks: globalMocks
  })

  return mockedSchema
}

export async function querySchema(args: GraphQLArgs) {
  return graphql(args)
}
