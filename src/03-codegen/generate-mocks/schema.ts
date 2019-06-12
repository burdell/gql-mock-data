import { GraphQLSchema } from 'graphql'
import { printSchema } from 'graphql/utilities/schemaPrinter'
import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools'
import { name } from 'faker'
import { writeToFile } from '../../write-to-file'

const globalMocks = {
  CheeseFan: () => ({
    title: name.prefix(),
    last_name: name.lastName()
  }),
  Int: () => {
    const min = Math.ceil(200)
    const max = Math.floor(0)
    return Math.floor(Math.random() * (max - min + 1)) + min
  }
}

export function addMocks(schema: GraphQLSchema, operationMocks = {}) {
  addMockFunctionsToSchema({
    schema,
    mocks: mergeResolvers(globalMocks, operationMocks)
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

type ResolvedScalar = string | number | boolean | null
type ResolvedValue = ResolvedScalar | Array<any> | { [key: string]: any }
type ResolverFunction = (...args: Array<any>) => ResolvedValue

export type ResolverMap = {
  [key: string]: () => {
    [key: string]: ResolvedValue | ResolverFunction
  } | null
}

/**
 * Given a map of mock GraphQL resolver functions, merge in a map of
 * desired mocks. Generally, `target` will be the default mocked values,
 * and `input` will be the values desired for a portal example or Jest tests.
 */
const mergeResolvers = (target: any, input: ResolverMap) => {
  const inputTypenames = Object.keys(input)
  const merged: ResolverMap = inputTypenames.reduce(
    (accum, key) => {
      const inputResolver = input[key]
      if (target.hasOwnProperty(key)) {
        const targetResolver = target[key]
        const resolvedInput = inputResolver()
        const resolvedTarget = targetResolver()
        if (
          !!resolvedTarget &&
          !!resolvedInput &&
          typeof resolvedTarget === 'object' &&
          typeof resolvedInput === 'object' &&
          !Array.isArray(resolvedTarget) &&
          !Array.isArray(resolvedInput)
        ) {
          const newValue = { ...resolvedTarget, ...resolvedInput }
          return {
            ...accum,
            [key]: () => newValue
          }
        }
      }
      return { ...accum, [key]: inputResolver }
    },
    { ...target }
  )
  return merged
}

export { mergeResolvers }
