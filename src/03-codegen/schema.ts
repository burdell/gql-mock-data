import { buildSchema } from 'graphql'
import { typeDefs } from './typeDefs'

export const schema = buildSchema(typeDefs)
