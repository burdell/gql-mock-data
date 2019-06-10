export interface GatherGQLOperation {
  name: string
  variables: Array<{ name: string; type: string }>
  operationString: string
}

interface GatherOperationConfig {
  [operationName: string]: {
    input?: { [inputVar: string]: any }
    mocks?: any
  }
}

interface GatherMockedData {
  [operationName: string]: any
}
