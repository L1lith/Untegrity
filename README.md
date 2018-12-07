# Untegrity
Discipline videos with poor integrity

## Installation
First install FFMPEG ([Found Here](http://ffmpeg.zeranoe.com/builds/)) and ensure it's path is set in your environment variables. You can test this by simply running  the command `ffmpeg`

For usage from within Node.js
```
npm i -s untegrity
```
For command line usage
```
npm i -g untegrity
```

## Command Line Basics
The basic usage looks like this.
```
untegrity method path ...otherMethodArguments [...options]
```
We can check the integrity of a given video file like this
```
untegrity valid ./video.mp4
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
#### This Readme is a Work in Progess.
