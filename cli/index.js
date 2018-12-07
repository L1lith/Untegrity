const args = require('yargs').argv
const pathType = require('path-type')
const resolvePath = require('../resolvePath')
const findVideoFiles = require('../findVideoFiles')

async function run() {
  if (args._.length > 1) throw 'Too many arguments'
  let path = args._[0] || args.path || args.p

  if (typeof path != 'string' || path.length < 1) throw "Must supply path string"
  let type = args.type || args.t
  if (['dir', 'directory'].includes(type)) type = 'folder'
  if (type !== null && (args.hasOwnProperty('t') || args.hasOwnProperty('type')) && !["file", "folder"].includes(type)) throw "The type argument must be file or folder"
  const recursive = args.recursive || args.r
  if (recursive !== null && (args.hasOwnProperty('r') || args.hasOwnProperty('recursive')) && typeof recursive != 'boolean') throw "The recursive argument must be a boolean"
  if (type === 'file' && recursive === true) throw "Cannot run recursively while in file mode"

  path = resolvePath(path, process.cwd())

  console.log(`Detecting Path Type at "${path}"`)

  if (await pathType.file(path)) {
    if (type === 'folder') throw 'The supplied path is a file not a folder'
    console.log("Checking Video File")
  } else if (await pathType.dir(path)) {
    if (type === 'file') throw 'The supplied path is a folder not a file'
    console.log("Beginning Directory Scan")
    const videoFiles = await findVideoFiles(path, recursive)
    if (videoFiles.length < 1) throw "No video files found"
  } else {
    throw "Path not Found."
  }
}

run().catch(err => {
  console.log("Error: " + err)
  process.exit(1)
})
