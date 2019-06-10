import { GatherOperationConfig } from './types'

export const OperationConfig: GatherOperationConfig = {
  ElectCheeseLord: {
    input: {
      cheeseFiendId: '1234'
    }
  },
  cheeseFiends: {
    mocks: {
      Query: () => ({
        cheeseFiends: () => [
          { title: 'Darth' },
          { title: 'Darth' },
          { title: 'Darth' },
          { title: 'Darth' },
          { title: 'Darth' },
          { title: 'Darth' }
        ]
      })
    }
  }
}
