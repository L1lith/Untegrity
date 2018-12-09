const args = require('yargs').argv
const pathType = require('path-type')
const resolvePath = require('../resolvePath')
const findVideoFiles = require('../findVideoFiles')
const checkIntegrity = require('../checkIntegrity')
const {unlink} = require('mz/fs')
const colors = require('colors')
const banner = require('./banner')

async function run() {
  if (args._.length > 1) throw 'Too many arguments'
  let path = args._[0] || args.path || args.p

  if (typeof path != 'string' || path.length < 1) throw "Must supply path string"
  let audioMode = args.audioMode || args.audio || args.a
  if (audioMode !== null && ['a', 'audio', 'audioMode'].some(property => args.hasOwnProperty(property)) && typeof audioMode != 'boolean') throw "The audio mode argument must be true/false"
  let type = args.type || args.t
  if (['dir', 'directory'].includes(type)) type = 'folder'
  if (type !== null && (args.hasOwnProperty('t') || args.hasOwnProperty('type')) && !["file", "folder"].includes(type)) throw "The type argument must be file or folder"
  const recursive = args.recursive || args.r
  if (recursive !== null && (args.hasOwnProperty('r') || args.hasOwnProperty('recursive')) && typeof recursive != 'boolean') throw "The recursive argument must be a boolean"
  if (type === 'file' && recursive === true) throw "Cannot run recursively while in file mode"
  const remove = false || args.remove || args.delete || args.rm || args.del || args.d
  if (remove !== null && ['rm', 'remove', 'del', 'delete'].some(property => args.hasOwnProperty(property)) && typeof remove != 'boolean') throw "The remove argument must be a boolean"
  const noBanner = false || args.noBanner
  if (args.hasOwnProperty('noBanner') && typeof args.noBanner != 'boolean') throw new Error("noBanner argument must be a boolean")
  path = resolvePath(path, process.cwd())

  if (noBanner !== true) console.log(banner)
  if (audioMode === true) console.log(colors.cyan("Running in Audio Mode"))

  if (await pathType.file(path)) {
    if (type === 'folder') throw 'The supplied path is a file not a folder'
    console.log("Checking Video File")
    await checkVideoFile(path, {audioMode, remove})
  } else if (await pathType.dir(path)) {
    if (type === 'file') throw 'The supplied path is a folder not a file'
    console.log("Beginning Directory Scan")
    const videoFiles = await findVideoFiles(path, recursive)
    if (videoFiles.length < 1) throw "No video files found"
    console.log(`Found ${videoFiles.length} video files, beginning individual scans`)
    for (let i = 0; i < videoFiles.length; i++) {
      const videoFile = videoFiles[i]
      console.log(`Scanning video file #${i + 1} at ${videoFile}`.cyan)
      await checkVideoFile(videoFile, {audioMode, remove})
    }
  } else {
    throw "Path not Found."
  }
}

async function checkVideoFile(path, {audioMode, remove}) {
  const errors = await checkIntegrity(path, {returnErrors: true, audioMode})
  if (errors.length < 1) {
    console.log("No errors found".green)
  } else {
    console.log("== ".red+errors.length + " errors found".red)
    if (remove === true) {
      console.log("Deleting Video File")
      await unlink(videoFile)
    }
  }
}

run().catch(err => {
  if (typeof err == 'string') {
    console.log(("Error: " + err).red)
  } else {
    console.log(err)
  }
  process.exit(1)
})
