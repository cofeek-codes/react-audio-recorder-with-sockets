import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'

const useRecorder = () => {
	const [audioURL, setAudioURL] = useState('')
	const [isRecording, setIsRecording] = useState(false)
	const [recorder, setRecorder] = useState(null)
	const socket = io('http://localhost:4200')

	const audioContext = new AudioContext()
	useEffect(() => {
		// sockets
		socket.on('connect', () => {
			console.log('connected to socket')
		})
		socket.on('speak', data => {
			console.log('speak on client')
			console.log(data)
			let blob = new Blob([data], { type: 'audio/webm' })
			let src = audioContext.createBufferSource()
			blob.arrayBuffer().then(buf => {
				audioContext.decodeAudioData(buf).then(audioBuf => {
					src.buffer = audioBuf
				})
			})

			src.connect(audioContext.destination)
			src.start(0)
		})
		// sockets
		// Lazily obtain recorder first time we're recording.
		if (recorder === null) {
			if (isRecording) {
				requestRecorder().then(setRecorder, console.error)
			}
			return
		}

		// Manage recorder state.
		if (isRecording) {
			recorder.start()
		} else {
			recorder.stop()
		}

		// Obtain the audio when ready.
		const handleData = e => {
			socket.emit('speak', e.data)
		}

		recorder.addEventListener('dataavailable', handleData)
		return () => recorder.removeEventListener('dataavailable', handleData)
	}, [recorder, isRecording])

	const startRecording = () => {
		setIsRecording(true)
	}

	const stopRecording = () => {
		setIsRecording(false)
	}

	return [audioURL, isRecording, startRecording, stopRecording]
}

async function requestRecorder() {
	const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
	return new MediaRecorder(stream)
}
export default useRecorder
