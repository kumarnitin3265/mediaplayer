
import { useEffect, useRef, useState } from 'react';
import aPlayer from './audioPlayer.module.css';

function AudioPlayer(){

    const [isRecording, setIsRecording] = useState(false);
    const [audioChunks, setAudioChunks] = useState([]);
    const [audioBlob, setAudioBlob] = useState(null);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const audioRef = useRef(null);
    const canvasRef = useRef(null);

    useEffect(() => {
        if(isRecording){
            navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
                const recorder = new MediaRecorder(stream);
                setMediaRecorder(recorder);
                visualAudio(stream);
                recorder.ondataavailable = (event) => {
                    setAudioChunks((prev) => [...prev, event.data]);
                };
                recorder.start();
            });
        }
    }, [isRecording]);

    // Start recording
    const startRecording = () => {
        setAudioChunks([]);
        setIsRecording(true);
    }

    // Stop recording and save audio blob
    const stopRecording = () => {
        if(mediaRecorder) {
            mediaRecorder.stop();
            mediaRecorder.onstop = () => {
                const blob = new Blob(audioChunks, { type: 'audio/wav'});
                setAudioBlob(blob);
                setIsRecording(false);
            }
        }
    }

    // Playback the recorded audio
    const playRecording = () => {
        if(audioBlob){
            const audioUrl = URL.createObjectURL(audioBlob);
            audioRef.current.src = audioUrl;
            audioRef.current.play();
        }
    };

    const visualAudio = (stream) => {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioCtx.createAnalyser();
        const source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);
        analyser.fftSize = 2048;

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        const canvasCtx = canvasRef.current.getContext('2d');

        const drawWaveForm = () => {
            requestAnimationFrame(drawWaveForm);
            analyser.getByteTimeDomainData(dataArray);

            canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            canvasCtx.lineWidth = 2;
            canvasCtx.strokeStyle = 'limegreen';
            canvasCtx.beginPath();

            const sliceWidth = (canvasRef.current.width * 1.0)/bufferLength;
            let x=0;

            for(let i=0; i<bufferLength; i++){
                const v = dataArray[i]/128.0;
                const y = (v * canvasRef.current.height)/2;

                if(i == 0){
                    canvasCtx.moveTo(x, y);
                } else {
                    canvasCtx.lineTo(x, y);
                }

                x += sliceWidth;
            }

            canvasCtx.lineTo(canvasRef.current.width, canvasRef.current.height/2);
            canvasCtx.stroke();
        };

        drawWaveForm();
    }

    return (
        <>
            <div className={aPlayer.audioPlayerContainer}>
                <h2>Audio Player</h2>
                <div className={aPlayer.controls}>
                    <button className={aPlayer.startButton} onClick={startRecording} disabled={isRecording}>
                        Start Recording
                    </button>
                    <button className={aPlayer.stopButton} onClick={stopRecording} disabled={!isRecording}>
                        Stop Recording
                    </button>
                    <button className={aPlayer.playButton} onClick={playRecording} disabled={!audioBlob}>
                        Play Recording
                    </button>
                </div>
                <canvas
                    ref={canvasRef}
                    className={aPlayer.waveformCanvas}
                    width="600"
                    height="100"
                ></canvas>
                <audio ref={audioRef} className={aPlayer.audioElement} controls></audio>
            </div>
        </>
    )
}

export default AudioPlayer;