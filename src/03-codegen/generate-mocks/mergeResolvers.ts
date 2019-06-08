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
