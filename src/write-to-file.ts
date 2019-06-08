import { writeFileSync } from 'fs'
import { resolve } from 'path'

export function writeToFile(data: any, dir: string, filename = 'output.json') {
  writeFileSync(resolve(dir, `${filename}`), JSON.stringify(data, null, 2))
}
