import * as React from 'react'
import useRecorder from './hooks/useRecorder'

function App() {
	let [audioURL, isRecording, startRecording, stopRecording] = useRecorder()
	return (
		<div className='App'>
			<button onClick={startRecording} disabled={isRecording}>
				start recording
			</button>
			<button onClick={stopRecording} disabled={!isRecording}>
				stop recording
			</button>
		</div>
	)
}

export default App
