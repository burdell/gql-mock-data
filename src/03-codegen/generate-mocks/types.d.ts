export interface GatherGQLOperation {
  name: string
  variables: string[]
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
