import React, { useState, useRef, useEffect  } from 'react'
import Draggable from 'react-draggable';
import {createRoot} from 'react-dom/client';
import './dragLayout.css';
import { generateThumbnail } from './generateThumbnail';
import Cookies from 'universal-cookie';
import { v4 as uuidv4 } from 'uuid';

const DragLayout = () => {
  const [draggedVideoSize, setDraggedVideoSize] = useState(null);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [videos, setVideos] = useState([])
  const [thumbnails, setThumbnails] = useState([]);
  const [showPanel, setShowPanel] = useState(false);
  const videoRef = useRef(null);
  const [flipped, setFlipped] = useState(false);
  const [showEditPanel, setShowEditPanel] = useState(false);
  const videoPlayerContainerRefs = useRef([]);

  const flipVideo = () => {
    if (videoRef.current) {
      videoRef.current.style.transform = flipped ? 'none' : 'rotate(180deg)';
      setFlipped(!flipped);
    }
  };
  
  const handleVideoClick = () => {
    setShowPanel(true);
    setShowPanel(!showPanel);
  };

  const handleEditVideoClick = () => {
    setShowEditPanel(true);
    setShowEditPanel(!showEditPanel);
  };

  const handleDragStart = (size, video) => {
    setDraggedVideoSize(size);
    setCurrentVideo(video);
  };

  const handleDragStop = () => {
    setDraggedVideoSize(null);
    setCurrentVideo(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleScreenSizeChange = (size) => {
    setDraggedVideoSize(size);
    setShowPanel(!showPanel);
  };

  const handleUpdateVideoSize = (size) => {
    setDraggedVideoSize(size);
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

  const VideoPlayer = ({ 
    boxLeft, boxTop, width, height, 
    currentVideo, videoRef, handleEditVideoClick }) => (
    <Draggable bounds="#drop-body">
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
            style={{ 
              objectFit: 'fill', 
              width: '100%', 
              height: '100%', 
              transform: flipped ? 'rotate(180deg)' : 'none',
            }}
            loop
            onClick={handleEditVideoClick}
          />
        )}
      </div>
    </Draggable>
  );
  
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

    const boxLeft = offsetX - width / 2;
    const boxTop = offsetY - height / 2;

    const videoPlayerContainer = document.createElement('div');
    modalBody.appendChild(videoPlayerContainer);
    createRoot(videoPlayerContainer).render(
      <VideoPlayer
        boxLeft={boxLeft}
        boxTop={boxTop}
        width={width}
        height={height}
        currentVideo={currentVideo}
        videoRef={videoRef}
        handleEditVideoClick={handleEditVideoClick}
      />
    );
    videoPlayerContainerRefs.current.push(videoPlayerContainer);

    const updatedVideos = videos.filter((video) => video.name !== currentVideo.name);
    const updatedThumbnails = thumbnails.filter((thumbnail, index) => index !== videos.indexOf(currentVideo));
    setVideos(updatedVideos);
    setThumbnails(updatedThumbnails);
  };

  const handleUpdateSize = () => {
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

    videoPlayerContainerRefs.current.forEach((videoPlayerContainer) => {
      const videoPlayer = videoPlayerContainer.firstChild;

      videoPlayer.style.width = `${width}px`;
      videoPlayer.style.height = `${height}px`;

      const offsetX = videoPlayerContainer.getBoundingClientRect().left + width / 2;
      const offsetY = videoPlayerContainer.getBoundingClientRect().top + height / 2;

      const boxLeft = offsetX - width / 2;
      const boxTop = offsetY - height / 2;

      videoPlayerContainer.style.left = `${boxLeft}px`;
      videoPlayerContainer.style.top = `${boxTop}px`;
    });
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
      className={`${showPanel || showEditPanel ? 'card card-body' : '' }`}
      style={{
        transition: 'margin-right 0.3s ease',
        marginRight: showPanel || showEditPanel ? '250px' : '0', }}
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
  {(showPanel || showEditPanel) && (
  <div className='panel-style'>
    {showPanel && ( 
      <div>
        <h2>Screen Size</h2>
        <button onClick={() => handleScreenSizeChange('small')}>Small</button>
        <button onClick={() => handleScreenSizeChange('medium')}>Medium</button>
        <button onClick={() => handleScreenSizeChange('large')}>Large</button>
      </div>
    )}
      <button
        style={{ position: 'absolute', top: '10px', right: '10px' }}
        onClick={showPanel ? handleVideoClick : (showEditPanel ? handleEditVideoClick : undefined)}
      >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="24"
        height="24"
      >
        <path d="M0 0h24v24H0z" fill="none" />
        <path
          fill="currentColor"
          d="M17.66 6.34L12.83 11.17l4.54 4.54A.996.996 0 1 1 15.54 
          18l-4.54-4.54-4.54 4.54A.996.996 0 1 1 5.46 15.54l4.54-4.54L5.46 
          6.34A.996.996 0 1 1 6.88 4.93l4.54 4.54 4.54-4.54a.996.996 0 1 1 1.41 1.41z"
        />
      </svg>
    </button>

    {showEditPanel && (
      <div>
        <h2>Update Video</h2>
        <div>
          <button onClick={flipVideo}>
            Reverse
          </button>
        </div>
        <div>
          <h2>Update Video Size </h2>
          <button onClick={() => handleUpdateVideoSize('small')}>Small</button>
          <button onClick={() => handleUpdateVideoSize('medium')}>Medium</button>
          <button onClick={() => handleUpdateVideoSize('large')}>Large</button>
          
          <button onClick={handleUpdateSize}>Update Size</button>
        </div>
      </div>
    )}
  </div>
)}
</div>
  )
}

export default DragLayout;