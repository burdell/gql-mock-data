import { GraphQLSchema } from 'graphql'
import { printSchema } from 'graphql/utilities/schemaPrinter'
import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools'

import { globalMocks } from './global-mocks'
import { mergeResolvers } from './mergeResolvers'

export function addMocks(schema: GraphQLSchema, mocks = {}) {
  addMockFunctionsToSchema({
    schema,
    mocks: mergeResolvers(globalMocks, mocks)
  })
}

export function mockSchema(schema: GraphQLSchema) {
  const mockedSchema = makeExecutableSchema({ typeDefs: printSchema(schema) })
  addMockFunctionsToSchema({
    schema: mockedSchema,
    mocks: globalMocks
  })

  return mockedSchema
}
