
import { useRef, useState } from "react";
import vPlayer from "./videoplayer.module.css";
import ReactPlayer from "react-player/youtube";
import axios from "axios";

function VideoPlayer() {

    const [url, setUrl] = useState("");
    const [videoUrl, setVideoUrl] = useState(null);
    const [showVideo, setShowVideo] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [played, setPlayed] = useState(0);
    const playerRef = useRef(null);

    const [originalText, setOriginalText] = useState("");
    const [translatedText, setTranslatedText] = useState("");

    const API_KEY = process.env.YOUTUBE_API_KEY;
    console.log(API_KEY);
    const YOUTUBE_API_URL = "https://www.googleapis.com/youtube/v3/search";

    const handlePlayPause = () => {
        setIsPlaying((prev) => !prev);
    }


    const handleSearch = async () => {
        if (url.trim()) {
            try {
                const response = await axios.get(YOUTUBE_API_URL, {
                    params: {
                        part: "snippet",
                        q: url,
                        type: "video",
                        key: API_KEY,
                        maxResutls: 1,
                    },
                });

                const videoId = response.data.items[0].id.videoId;
                setVideoUrl(`https://www.youtube.com/watch?v=${videoId}`);
                setShowVideo(true);
                setIsPlaying(true);
                setUrl("");
            } catch (error) {
                console.error(error);
            }
        }
    }

    const handleProgress = (state) => {
        setPlayed(state.played);
    }

    const handleSeekChange = (e) => {
        const newValue = parseFloat(e.target.value);
        setPlayed(newValue);
        playerRef.current.seekTo(newValue);
    }

    return (
        <>
            <div className={vPlayer.videoPlayerContainer}>
                <h2 className={vPlayer.title}>VideoPlayer</h2>
                <div className={vPlayer.searchBar}>
                    <input
                        className={vPlayer.searchInput}
                        type="text"
                        placeholder="Provide the song video..."
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                    />
                    <button type="submit" className={vPlayer.searchButton} onClick={handleSearch}>
                        Search
                    </button>
                </div>

                {showVideo && videoUrl && (
                    <div className={vPlayer.playerWrapper}>
                        <ReactPlayer 
                            ref={playerRef}
                            url={videoUrl} 
                            playing={isPlaying} 
                            onProgress={handleProgress}
                            progressInterval={1000}
                            className={vPlayer.reactPlayer}
                        />
                        <button onClick={handlePlayPause} className={vPlayer.playPauseButton}>
                            {isPlaying ? "Pause" : "Play"}
                        </button>
                        <input 
                            type="range"
                            min={0}
                            max={1}
                            step="any"
                            value={played}
                            onChange={handleSeekChange}
                            className={vPlayer.seekBar}
                        />
                    </div>
                )}
                <div className={vPlayer.dialogueContainer}>
                    <h3>Dialogue</h3>
                    <div className={vPlayer.dialogueSection}>
                        <div>
                            <label htmlFor="originalText">Original Text:</label>
                            <textarea
                                id="originalText"
                                className={vPlayer.dialogueInput}
                                value={originalText}
                                onChange={(e) => setOriginalText(e.target.value)}
                                placeholder="Enter original dialogue text here..."
                            />
                        </div>

                        <div>
                            <label htmlFor="translatedText">Translated Text:</label>
                            <textarea
                                id="translatedText"
                                className={vPlayer.dialogueInput}
                                value={translatedText}
                                onChange={(e) => setTranslatedText(e.target.value)}
                                placeholder="Enter translated dialogue text here..."
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default VideoPlayer;