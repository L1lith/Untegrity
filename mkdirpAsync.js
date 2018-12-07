const mkdirp = require('mkdirp')

function mkdirpAsync(...args) {
  return new Promise((resolve, reject) => {
    mkdirp(...args, err => {
      if (err) return reject(err)
      resolve()
    })
  })
}

module.exports = mkdirpAsync
