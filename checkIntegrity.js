const {exec} = require('child_process')
const {join} = require('path')
const nanoid = require('nanoid')
const mkdirpAsync = require('./mkdirpAsync')
const {readFile, unlink} = require('mz/fs')

const logsDirectory = join(__dirname, 'logs')

let firstLaunch = true

async function checkIntegrity(videoPath, options) {
  const {audioMode=false} = options || {}
    if (firstLaunch) {
      await mkdirpAsync(logsDirectory)
      firstLaunch = false
    }
    const errorLogPath = join(logsDirectory, nanoid() + '.log')
    await new Promise((resolve, reject) => {
      exec(`ffmpeg -v error -i ${videoPath}${audioMode === true ? ' -map 0:1' : ''} -f null - >${errorLogPath} 2>&1`, (err => {
        if (err) return reject(err)
        resolve()
      }))
    })
    const errors = (await readFile(errorLogPath)).toString().split('\n').filter(line => line.trim().length > 0)
    const valid = errors.length === 0
    await unlink(errorLogPath)
    return valid
}

module.exports = checkIntegrity
