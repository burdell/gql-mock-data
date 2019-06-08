import { name } from 'faker'

export const mocks = {
  Person: () => ({
    first_name: name.firstName(),
    last_name: name.lastName()
  }),
  Int: () => {
    const min = Math.ceil(200)
    const max = Math.floor(0)
    return Math.floor(Math.random() * (max - min + 1)) + min
  }
}
