
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import VideoPlayer from './components/VideoPlayer/videoPlayer';
import AudioPlayer from './components/AudioPlayer/audioPlayer';
import Navbar from './Navbar/Navbar';

function App() {

  const router = createBrowserRouter([
    {path: "/", element: <Navbar />},
    {path: "/videoPlayer", element: <VideoPlayer />},
    {path: "/audioPlayer", element: <AudioPlayer />}
  ]);


  return (
    <div className="App">
        <RouterProvider router={router} />
    </div>
  );
}

export default App;
