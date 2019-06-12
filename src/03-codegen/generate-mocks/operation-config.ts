import { GatherOperationConfig } from './types'

export const OperationConfig: GatherOperationConfig = {
  ElectCheeseLord: {
    input: {
      cheeseFanId: '1234'
    }
  },
  GetCheeseFans: {
    mocks: {
      Query: () => ({
        cheeseFans: () => [
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
