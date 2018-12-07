const args = require('yargs').argv
const pathType = require('path-type')
const resolvePath = require('../resolvePath')

async function run() {
  if (args._.length > 1) throw 'Too many arguments'
  let path = args._[0] || args.path || args.p

  if (typeof path != 'string' || path.length < 1) throw "Must supply path string"
  let type = args.type || args.t
  if (['dir', 'directory'].includes(type)) type = 'folder'
  if (type !== null && (args.hasOwnProperty('t') || args.hasOwnProperty('type')) && !["file", "folder"].includes(type)) throw "The type argument must be file or folder"

  path = resolvePath(path, process.cwd())

  if (await pathType.file(path)) {
    if (type === 'folder') throw 'The supplied path is a file not a folder'
    console.log("Checking Video File")
  } else if (await pathType.dir(path)) {
    if (type === 'file') throw 'The supplied path is a folder not a file'
    console.log("Beginning Directory Scan")
  } else {
    throw "Path not Found."
  }
}

run().catch(err => {
  console.log("Error: " + err)
  process.exit(1)
})
