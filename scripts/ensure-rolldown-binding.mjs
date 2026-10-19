// npm skips rolldown's native binding (an optional dependency) when the Node
// version doesn't satisfy its engines range (e.g. Node 20.18). Install the
// matching binding on demand so `vite build` can load rolldown.
import { execSync } from 'node:child_process'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

const platformSuffix = () => {
  const { platform, arch } = process
  if (platform === 'linux') {
    const glibc = process.report?.getReport().header.glibcVersionRuntime
    return `linux-${arch}-${glibc ? 'gnu' : 'musl'}`
  }
  if (platform === 'win32') return `win32-${arch}-msvc`
  return `${platform}-${arch}`
}

const binding = `@rolldown/binding-${platformSuffix()}`

try {
  require.resolve(binding, { paths: [require.resolve('rolldown')] })
} catch {
  const { version } = require('rolldown/package.json')
  console.log(`Installing missing native binding ${binding}@${version}`)
  execSync(`npm install --no-save --no-audit --no-fund --force ${binding}@${version}`, {
    stdio: 'inherit',
  })
}
