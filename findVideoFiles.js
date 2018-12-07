const dir = require('node-dir')
const {readdir} = require('mz/fs')
const pathType = require('path-type')
const isVideoFile = require('./isVideoFile')
const {join} = require('path')

async function findVideoFiles(directory, recursive=false) {
  let files = await readdir(directory)
  files = await Promise.all(files.map(async file => {
    file = join(directory, file)
    if (await pathType.dir(file)) {
      if (recursive === false) return []
      return findVideoFiles(file)
    } else if (await pathType.file(file)) {
      return [file]
    } else {
      return []
    }
  }))
  files = [].concat.apply([], files)
  return files.filter(isVideoFile)
}

module.exports = findVideoFiles
