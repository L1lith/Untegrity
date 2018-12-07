const {extname} = require('path')
const knownVideoExtensions = [".webm",".mkv",".flv",".flv",".vob",".ogv",".ogg",".drc",".gif",".gifv",".mng",".avi",".MTS",".M2TS",".mov",".qt",".wmv",".yuv",".rm",".rmvb",".asf",".amv",".mp4",".m4p",".m4v",".mpg",".mp2",".mpeg",".mpe",".mpv",".mpg",".mpeg",".m2v",".m4v",".svi",".3gp",".3g2",".mxf",".roq",".nsv",".flv",".f4v",".f4p",".f4a",".f4b"]

function isVideoFile(path) {
  console.log(path)
  const extension = extname(path)
  if (!extension) return false
  return knownVideoExtensions.includes(extension)
}

module.exports = isVideoFile
