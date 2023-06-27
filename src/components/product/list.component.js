import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {Button} from 'react-bootstrap'
import axios from 'axios';
import Swal from 'sweetalert2'
import Draggable from 'react-draggable';
import './component.css';
import { motion } from "framer-motion";

export default function List() {

  const [products, setProducts] = useState([])
  const [draggedVideos, setDraggedVideos] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(-1);
  const [newWidth, setNewWidth] = useState('');
  const [newHeight, setNewHeight] = useState('');
  const [sliderWidth, setSliderWidth] = useState(0);
  const [sliderHeight, setSliderHeight] = useState(0);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  const handleWidthChange = (event) => {
    setNewWidth(event.target.value);
  };

  const handleHeightChange = (event) => {
    setNewHeight(event.target.value);
  };

  const handleApplyChanges = () => {
    const videos = [...draggedVideos];
    const selectedVideo = videos[selectedVideoIndex];
    selectedVideo.width = parseInt(newWidth);
    selectedVideo.height = parseInt(newHeight);
    setDraggedVideos(videos);
    localStorage.setItem('draggedVideos', JSON.stringify(videos));
  };

  const handleSliderWidthChange = (event) => {
    const width = parseInt(event.target.value);
    setSliderWidth(width);
    setNewWidth(width.toString());
    updateSelectedVideoSize(width, parseInt(newHeight));
  };

  const handleSliderHeightChange = (event) => {
    const height = parseInt(event.target.value);
    setSliderHeight(height);
    setNewHeight(height.toString());
    updateSelectedVideoSize(parseInt(newWidth), height);
  };

  const updateSelectedVideoSize = (width, height) => {
    if (selectedVideoIndex !== -1) {
      const videos = [...draggedVideos];
      const selectedVideo = videos[selectedVideoIndex];
      selectedVideo.width = width;
      selectedVideo.height = height;
      setDraggedVideos(videos);
      localStorage.setItem('draggedVideos', JSON.stringify(videos));
    }
  };

  const handleVideoClick = (index) => {
    setSelectedVideoIndex(index);
    const selectedVideo = draggedVideos[index];
    if (selectedVideo) {
      setX(Math.round(selectedVideo.offset.left));
      setY(Math.round(selectedVideo.offset.top));
      localStorage.setItem('x', Math.round(selectedVideo.offset.left).toString());
      localStorage.setItem('y', Math.round(selectedVideo.offset.top).toString());
    }
  };

  const handlePanelClose = () => {
    setSelectedVideoIndex(-1);
    setNewWidth("");
    setNewHeight("");
  };
  
  const handleSendToBack = () => {
    if (selectedVideoIndex > 0) {
      const updatedVideos = [...draggedVideos];
      const selectedVideo = updatedVideos[selectedVideoIndex];
      updatedVideos.splice(selectedVideoIndex, 1);
      updatedVideos.unshift(selectedVideo);
      setDraggedVideos(updatedVideos);
      setSelectedVideoIndex(0);
      localStorage.setItem('draggedVideos', JSON.stringify(updatedVideos));
      localStorage.setItem('selectedVideoIndex', '0');
    }
  };

  const handleSendToFront = () => {
    if (selectedVideoIndex < draggedVideos.length - 1) {
      const updatedVideos = [...draggedVideos];
      const selectedVideo = updatedVideos[selectedVideoIndex];
      updatedVideos.splice(selectedVideoIndex, 1);
      updatedVideos.push(selectedVideo);
      setDraggedVideos(updatedVideos);
      setSelectedVideoIndex(updatedVideos.length - 1);
      localStorage.setItem('draggedVideos', JSON.stringify(updatedVideos));
      localStorage.setItem('selectedVideoIndex', (updatedVideos.length - 1).toString());
    }
  };

  const handleZoomChange = (event) => {
    const newZoomLevel = parseInt(event.target.value);
    setZoomLevel(newZoomLevel);
    localStorage.setItem('zoomLevel', newZoomLevel);
  };

  useEffect(()=>{
        fetchProducts() 
  },[])

  const fetchProducts = async () => {
        await axios.get(`http://localhost:8000/api/products`).then(({data})=>{
            setProducts(data)
        })
  };

  const deleteProduct = async (id) => {
        const isConfirm = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
          }).then((result) => {
            return result.isConfirmed
          });

          if(!isConfirm){
            return;
          }

          await axios.delete(`http://localhost:8000/api/products/${id}`).then(({data})=>{
            Swal.fire({
                icon:"success",
                text:data.message
            })
            fetchProducts()
          }).catch(({response:{data}})=>{
            Swal.fire({
                text:data.message,
                icon:"error"
            })
          })
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const videoSrc = event.dataTransfer.getData('text/plain');
    const selectedSize = event.dataTransfer.getData('size');
    const { height, width } = getScreenSizeDimensions(selectedSize);

    const existingVideos = JSON.parse(localStorage.getItem('draggedVideos')) || [];
    const newVideo = { videoSrc, selectedSize, height, width };

    const dropBody = document.getElementById('drop-body');
    const offsetLeft = event.clientX - dropBody.getBoundingClientRect().left;
    const offsetTop = event.clientY - dropBody.getBoundingClientRect().top;

    newVideo.offset = { left: offsetLeft, top: offsetTop };
    setX(Math.round(offsetLeft));
    setY(Math.round(offsetTop));


    const updatedVideos = [...existingVideos, newVideo];
    setDraggedVideos(updatedVideos);

    localStorage.setItem('draggedVideos', JSON.stringify(updatedVideos));
    localStorage.setItem('x', Math.round(offsetLeft).toString());
    localStorage.setItem('y', Math.round(offsetTop).toString());
  };

  const handleVideoClickSpawn = (event, videoSrc, selectedSize) => {
    event.preventDefault();
    const { height, width } = getScreenSizeDimensions(selectedSize);
  
    const existingVideos = JSON.parse(localStorage.getItem('draggedVideos')) || [];
    const newVideo = { videoSrc, selectedSize, height, width };
  
    const dropBody = document.getElementById('drop-body');
    const offsetLeft = event.clientX - dropBody.getBoundingClientRect().left;
    const offsetTop = event.clientY - dropBody.getBoundingClientRect().top;
    newVideo.offset = { left: offsetLeft, top: offsetTop };
  
    const updatedVideos = [...existingVideos, newVideo];
  
    setDraggedVideos(updatedVideos);
    localStorage.setItem('draggedVideos', JSON.stringify(updatedVideos));
  };

  const handleReposition = () => {
  const updatedVideos = [...draggedVideos];
  const selectedVideo = updatedVideos[selectedVideoIndex];
    if (selectedVideo) {
      selectedVideo.offset = { left: x, top: y };
      setDraggedVideos(updatedVideos);
      localStorage.setItem('draggedVideos', JSON.stringify(updatedVideos));
    }
  };

  useEffect(() => {
    const storedX = localStorage.getItem('x');
    const storedY = localStorage.getItem('y');
    const storedVideos = localStorage.getItem('draggedVideos');
    const storedIndex = localStorage.getItem('selectedVideoIndex');
    const storedZoomLevel = localStorage.getItem('zoomLevel');

    if (storedX && storedY) {
      setX(parseInt(storedX));
      setY(parseInt(storedY));
    }

    if (storedVideos && storedIndex) {
      setDraggedVideos(JSON.parse(storedVideos));
      setSelectedVideoIndex(parseInt(storedIndex));
    }

    if (storedZoomLevel) {
      setZoomLevel(parseInt(storedZoomLevel));
    }
  }, []);

  useEffect(() => {
    if (selectedVideoIndex !== -1) {
      setNewWidth(draggedVideos[selectedVideoIndex]?.width.toString());
      setNewHeight(draggedVideos[selectedVideoIndex]?.height.toString());
      setSliderWidth(draggedVideos[selectedVideoIndex]?.width || 0);
      setSliderHeight(draggedVideos[selectedVideoIndex]?.height || 0);
    }
  }, [selectedVideoIndex, draggedVideos]);

  const handleRemoveAll = () => {
    setDraggedVideos([]);
    localStorage.removeItem('draggedVideos');
  };

  const getScreenSizeDimensions = (selectedSize) => {
      switch (selectedSize) {
        case "small":
          return { height: "200px", width: "100px" };
        case "medium":
          return { height: "300px", width: "200px" };
        case "large":
          return { height: "400px", width: "300px" };
        default:
          return { height: "0px", width: "0px" };
      }
  };
      
  const handleDragOver = (event) => {
        event.preventDefault();
  };

  const handleSwap = (event, targetIndex) => {
    event.preventDefault();
    const productId = event.dataTransfer.getData('text/plain');
    const updatedProducts = [...products];
    const draggedProductIndex = updatedProducts.findIndex((product) => product.id === productId);
    const draggedProduct = updatedProducts.splice(draggedProductIndex, 1)[0];
    updatedProducts.splice(targetIndex, 0, draggedProduct);
    setProducts(updatedProducts);

    localStorage.setItem('products', JSON.stringify(updatedProducts));
  };

  const handleFlip = () => {
    const updatedVideos = [...draggedVideos];
    const video = updatedVideos[selectedVideoIndex];
    if (video) {
      video.rotation = (video.rotation || 0) + 180;
      setDraggedVideos(updatedVideos);
      localStorage.setItem('draggedVideos', JSON.stringify(updatedVideos));
    }
  };

  const handleMirror = () => {
    const updatedVideos = [...draggedVideos];
    const video = updatedVideos[selectedVideoIndex];
    if (video) {
      // Mirror the video
      video.mirrored = !video.mirrored;
      setDraggedVideos(updatedVideos);
      localStorage.setItem('draggedVideos', JSON.stringify(updatedVideos));
    }
  };

    return (
      <div className="container">
          <div className="row">
            <div className='col-12'>
                <Link 
                    className='btn btn-primary mb-2 float-end' 
                    to={"/product/create"}>
                    Upload Video
                </Link>
                <Button 
                    variant = 'danger' 
                    onClick={handleRemoveAll}>Remove All Videos
                </Button>
            </div>
            <div className="col-12">
            <div className={`${selectedVideoIndex ? 'card card-body' : '' }`}
              style={{
                transition: 'margin-right 0.3s ease',
                marginRight: selectedVideoIndex !== -1 ? '250px' : '0', }}
            >
              <div className="table-responsive">
              <div className="d-flex flex-wrap">
                  {products.length > 0 &&
                    products.map((row, index) => (
                        <motion.div
                          key={row.id}
                          className="card m-2"
                          draggable
                          onDragOver={handleDragOver}
                          onDrop={(event) => handleSwap(event, index)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          layout
                        >
                        <div className="card-body">
                          <h5 className="card-title">{row.title}</h5>
                          <p className="card-text">Size: {row.size}</p>
                          <video
                            loop
                            autoPlay
                            width="75px"
                            draggable
                            onDragStart={(event) => {
                              event.dataTransfer.setData(
                                'text/plain',
                                `http://localhost:8000/storage/product/video/${row.video}`
                              );
                              event.dataTransfer.setData('size', row.size);
                            }}
                            onClick={(event) => {
                              const videoSrc = `http://localhost:8000/storage/product/video/${row.video}`;
                              const selectedSize = row.size;
                              handleVideoClickSpawn(event, videoSrc, selectedSize);
                            }}
                          >
                            <source
                              src={`http://localhost:8000/storage/product/video/${row.video}`}
                              type="video/mp4"
                            />
                          </video>
                          <div className="d-flex justify-content-between mt-2">
                            <Link to={`/product/edit/${row.id}`} className="btn btn-success me-2">
                              Edit
                            </Link>
                            <Button variant="danger" onClick={() => deleteProduct(row.id)}>
                              Delete
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                </div>
                <div style={{ padding: '10px' }}>
                <div style={{ width: '100%' }}>
                  <div
                    className="drop-body"
                    id="drop-body"
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    style={{ zoom: `${zoomLevel}%` }}
                  >
                   {draggedVideos && draggedVideos.length > 0 ? (
                    <>
                      {draggedVideos.map((video, index) => (
                        <div key={index}>
                          <Draggable bounds="#drop-body">
                            <div 
                              style={{ 
                                width: video.width, 
                                height: video.height,
                                position: 'absolute',
                                left: video.offset.left,
                                top: video.offset.top,
                              }}
                              onClick={() => handleVideoClick(index)} 
                            >
                              <video 
                                loop autoPlay  
                                src={video.videoSrc} 
                                type="video/mp4"
                                style={{ 
                                  objectFit: 'fill', 
                                  width: '100%', 
                                  height: '100%', 
                                  transform: `rotate(${video.rotation || 0}deg) 
                                  ${video.mirrored ? 'scaleX(-1)' : ''}`,}}
                              />
                              </div>
                          </Draggable>
                        </div>
                      ))}                     
                    </>
                    ) : (
                      <p>No videos dropped yet.</p>
                    )}
                    </div>
                    <div>
                      <input
                        type="range"
                        min="50"
                        max="200"
                        value={zoomLevel}
                        onChange={handleZoomChange}
                      />
                    </div>
                </div>
                </div>
              </div>
            </div>
            </div>
    {selectedVideoIndex !== -1 && (
      <div className="panel-style">
        <Button 
          variant='danger'
          className="close-button float-end" 
          onClick={handlePanelClose}> Close
        </Button>
      <div>    
        <div className='size-container'>
          <h4>Change Size</h4>
          {/* put the value={newHeight&width} inside the input field if necessary */}
          <input type="text" onChange={handleWidthChange} placeholder="New Width" />
          <input type="text" onChange={handleHeightChange} placeholder="New Height" />

          <input type="range" min="0" max="300" value={sliderWidth} onChange={handleSliderWidthChange} />
          <input type="range" min="0" max="400" value={sliderHeight} onChange={handleSliderHeightChange} />
          <p>Width: {newWidth}</p>
          <p>Height: {newHeight}</p>
          <button className= 'BF-btn' onClick={handleApplyChanges}>Apply Changes</button>
        </div> 

        <div className='size-container'>
          <h4>Change Position</h4>
          <input type="number" id="x" value={x} onChange={(e) => setX(Math.round(parseInt(e.target.value)))} />
          <input type="number" id="y" value={y} onChange={(e) => setY(Math.round(parseInt(e.target.value)))} />
          <p>Selected Video:</p>
          <p>x: {x}</p>
          <p>y: {y}</p>
          <button className= 'BF-btn'onClick={handleReposition}>Reposition</button>
        </div>
        <div className='size-container'>
          <h4>Send to Back & Front</h4>
          <button className= 'BF-btn' onClick={handleSendToBack}>Send to Back</button>
          <button onClick={handleSendToFront}>Send to Front</button>
        </div>
        <div className='size-container'>
          <h4>Transform Video</h4>
          <button className='BF-btn' onClick={handleFlip}>Flip 180°</button>
          <button className='BF-btn' onClick={handleMirror}>Mirror</button>
        </div>
      </div>
      </div>
    )}
    </div>
  </div>
  )
}
