const checkIntegrity = require('./checkIntegrity')

module.exports = Object.freeze(Object.assign((...args)=>checkIntegrity(...args), {checkIntegrity}))
