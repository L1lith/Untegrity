const {spawn} = require('child_process')
const {join} = require('path')
const nanoid = require('nanoid')
const mkdirpAsync = require('./mkdirpAsync')
const {readFile, unlink} = require('mz/fs')

const logsDirectory = join(__dirname, 'logs')

try { // Remove Leftover Logs from early termination just to prevent wasted hard drive space
  require('rimraf')(logsDirectory)
} catch(error) {}

let firstLaunch = true

async function checkIntegrity(videoPath, options) {
  const {audioMode=false, returnErrors=false} = options || {}
    if (firstLaunch) {
      await mkdirpAsync(logsDirectory)
      firstLaunch = false
    }
    const errors = await runFFMPEGCheck(videoPath, {audioMode})
    //console.log('hi', errors)
    //await (new Promise(res => setTimeout(res, 100000)))
    // await new Promise((resolve, reject) => {
    //   exec(`ffmpeg -v error -i "${videoPath}"${audioMode === true ? ' -map 0:1' : ''} -f null - >"${errorLogPath}" 2>&1`, ((err, stdout, stderr) => {
    //     if (err) return reject(err)
    //     if (stderr) console.log(stderr)
    //     //if (stdout) console.log('stdout')
    //     resolve()
    //   }))
    // })
    const valid = errors.length === 0
    if (returnErrors === true) {
      return errors
    }
    return valid
}

function runFFMPEGCheck(videoPath, options) {
  return new Promise((resolve, reject) => {
    const {audioMode=false} = options || {}
    const errorLogPath = join(logsDirectory, nanoid() + '.log')
    const process = spawn('ffmpeg', `-v error -i "${videoPath}"${audioMode === true ? ' -map 0:1' : ''} -f null - >"${errorLogPath}" 2>&1`.split(' '), {shell: true})
    process.on('close', code => {
      if (code === 0) {
        readFile(errorLogPath).then(errorBuffer => {
          const errors = errorBuffer.toString().split('\n').filter(line => line.trim().length > 0)
          unlink(errorLogPath).then(()=>{
            resolve(errors)
          }).catch(reject)
        }).catch(reject)
      } else {
        console.log("Fatal FFMPEG Error")
        unlink(errorLogPath).then(()=>{
          resolve(['Fatal FFMPEG Error'])
        }).catch(reject)
      }
    })
  })
}

module.exports = checkIntegrity
