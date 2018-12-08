# Untegrity
Discipline videos with poor integrity

## Installation
First install FFMPEG ([Found Here](http://ffmpeg.zeranoe.com/builds/)) and ensure it's path is set in your environment variables. You can test this by simply running  the command `ffmpeg`

For usage from within a Node.js project
```
npm i -s untegrity
```
For command line usage
```
npm i -g untegrity
```

## Command Line Basics
Commands are formatted like this
```
untegrity path [...options]
```
We can check the integrity of a given video file like this, also it can accept folders instead.
```
untegrity ./video.mp4
```
Here's an example of recursively searching through directories and deleting the corrupt video files
```
untegrity . -dr
```

## Node.js Basics
We can check the integrity of a video like this
```
const {checkIntegrity} = require('untegrity')
const join = require('join')

async function run() {
	const valid = await checkIntegrity(join(__dirname, 'video.mp4'))
	if (valid) {
		console.log("Video Valid!)
	} else {
		console.log("Video Invalid :(")
	}
}

run().catch(console.log)
```
## Command Line Arguments

*Usage*
```
untegrity videoPath [-t type | -type] [-r | -recursive] [-rm | -del | -remove | -delete | -d]
```
| Flag | Description                                                             |
|------|-------------------------------------------------------------------------|
| --r  | If doing a folder search check subdirectories recursively               |
| --t  | Specify either a video or folder path type to prevent unwanted behavior |
| --rm | Delete corrupt videos found.                                            |

## Node.js Methods
### checkIntegrity
Checks the integrity of a single video

Usage
```
const {checkIntegrity} = require('untegrity')
const {join} = require('path')

checkIntegrity(join(__dirname, './movie.mp4')).then(valid => {
	if (valid) {
		console.log("Video Valid")
	} else {
		console.log("Video Invalid")
	}
}).catch(console.log)
```
