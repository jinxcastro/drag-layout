import React, { useState, useRef } from 'react'
import Draggable from 'react-draggable';
import {createRoot} from 'react-dom/client';
import './loginPage.css';
import { generateThumbnail } from './generateThumbnail';

const LoginPage = () => {
  const [draggedVideoSize, setdraggedVideoSize] = useState(null);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [videos, setVideos] = useState([]);
  const [thumbnails, setThumbnails] = useState([]);
  const videoRef = useRef(null);
  const [showPanel, setShowPanel] = useState(false);

  const handleVideoClick = () => {
    setShowPanel(true);
    setShowPanel(!showPanel);
  };

  const handleFileSelect = (event) => {
    const selectedFiles = event.target.files;
    const selectedVideos = Array.from(selectedFiles);
    setVideos((prevVideos) => [...prevVideos, ...selectedVideos]);
    setCurrentVideo(selectedVideos[0]);

    const thumbnailPromises = selectedVideos.map((video) => generateThumbnail(video));
    Promise.all(thumbnailPromises).then((thumbnails) => {
      setThumbnails((prevThumbnails) => [...prevThumbnails, ...thumbnails]);
    });
  };
  
  const handleDragStart = (size, video) => {
    setdraggedVideoSize(size);
    setCurrentVideo(video);
  };

  const handleDragStop = () => {
    setdraggedVideoSize(null);
    setCurrentVideo(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleScreenSizeChange = (size) => {
    setdraggedVideoSize(size);
    setShowPanel(!showPanel);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const modalBody = document.getElementById('drop-body');
  
    const offsetX = e.clientX - modalBody.getBoundingClientRect().left;
    const offsetY = e.clientY - modalBody.getBoundingClientRect().top;
  
    let width, height;
      if (draggedVideoSize === 'small') {
        width = 100;
        height = 200;     
      } else if (draggedVideoSize === 'medium') {
        width = 200;
        height = 300; 
      } else if (draggedVideoSize === 'large') {
        width = 300;
        height = 400;
      } else {
        return; 
      }
      setCurrentVideo((prevVideo) => ({
        ...prevVideo,
        width,
        height,
      }));
  
    const boxLeft = offsetX - width / 2;
    const boxTop = offsetY - height / 2;
  
    const VideoPlayer = () => (
      <Draggable bounds= '#drop-body'>
      <div
        style={{
          position: 'absolute',
          left: `${boxLeft}px`,
          top: `${boxTop}px`,
          width: `${width}px`,
          height: `${height}px`,
          border: '1px solid black',
          zIndex: '9999',
          cursor: 'move',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'black',
        }}
      >
      {currentVideo && (
            <video
              ref={videoRef}
              src={URL.createObjectURL(currentVideo)}
              autoPlay
              style={{ objectFit: 'fill', width: '100%', height: '100%' }}
              loop
              onClick={handleVideoClick}
            />
          )}
      </div>
      </Draggable>
    );

      const videoPlayerContainer = document.createElement('div');
      modalBody.appendChild(videoPlayerContainer);
      createRoot(videoPlayerContainer).render(<VideoPlayer />);
};
  
  return (
    <div className="container">
  <div className="row">
    <div className='col-12 search-btn-row'>
      <div className='float-start'>
        <input type="file" multiple onChange={handleFileSelect} />
      </div>
    </div>
  </div>

  <div className="col-12">
    <div 
      className={`${ showPanel ? 'card card-body' : '' }`} 
      style = {{transition: 'margin-right 0.3s ease', marginRight: showPanel ? '250px' : '0',}}
    >
      <div className="table-responsive">
        <table className="table table-bordered mb-0 text-center">
          <thead>
            <tr>
              <th>Import</th>
              <th>Drop Area</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td style={{ width: '30%'}}>
                <div style={{ width: '100%', height: '100%' }}>
                  <div
                    className='screen-size-player'
                    id="screen-size-player"
                  >
                    {videos.map((video, index) => (
                      <div
                        style={{ width: '100%', height: 'auto' }}
                        key={index}
                      >
                        <div onClick={handleVideoClick} style={{ cursor: 'pointer' }} >
                        <img
                            className='img-thumbnail'
                            src={thumbnails[index]}
                            alt="Thumbnail"
                            draggable
                            onDragStart={() => handleDragStart(draggedVideoSize, video)}
                            onDragEnd={handleDragStop}
                          />
                           {video.name}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </td>
              <td>
                <div style={{ width: '100%' }}>
                  <div
                    className='drop-body'
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    id="drop-body"
                  ></div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  {showPanel && (
        <div className='panel-style'>
          <h2>Screen Size</h2>
          <div>
            <button onClick={() => handleScreenSizeChange('small')}>Small</button>
            <button onClick={() => handleScreenSizeChange('medium')}>Medium</button>
            <button onClick={() => handleScreenSizeChange('large')}>Large</button>
          </div>
          <button style={{ position: 'absolute', top: '10px', right: '10px' }} onClick={handleVideoClick}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
            >
              <path d="M0 0h24v24H0z" fill="none" />
              <path
                fill="currentColor"
                d="M17.66 6.34L12.83 11.17l4.54 4.54A.996.996 0 1 1 15.54 18l-4.54-4.54-4.54 4.54A.996.996 0 1 1 5.46 15.54l4.54-4.54L5.46 6.34A.996.996 0 1 1 6.88 4.93l4.54 4.54 4.54-4.54a.996.996 0 1 1 1.41 1.41z"
              />
            </svg>
          </button>
        </div>
      )}
</div>
  )
}

export default LoginPage;