import fs from 'fs'

// Using import fails due to the current TypeScript configuration
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8')) as any & { version: string }

export default pkg
