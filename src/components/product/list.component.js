import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button'
import axios from 'axios';
import Swal from 'sweetalert2'
import Draggable from 'react-draggable';

export default function List() {

    const [products, setProducts] = useState([])
    const [draggedVideo, setDraggedVideo] = useState(null);


    useEffect(()=>{
        fetchProducts() 
    },[])

    const fetchProducts = async () => {
        await axios.get(`http://localhost:8000/api/products`).then(({data})=>{
            setProducts(data)
        })
    }

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
    }

    const handleDrop = (event) => {
      event.preventDefault();
      const videoSrc = event.dataTransfer.getData('text/plain');
      const selectedSize = event.dataTransfer.getData('size');
      const { height, width } = getScreenSizeDimensions(selectedSize);
    
      setDraggedVideo({ videoSrc, selectedSize, height, width });
    };
    

    const getScreenSizeDimensions = (selectedSize) => {
      switch (selectedSize) {
        case "small":
          return { height: "100px", width: "200px" };
        case "medium":
          return { height: "200px", width: "3000px" };
        case "large":
          return { height: "300px", width: "400px" };
        default:
          return { height: "75px", width: "auto" };
      }
    };
      
      function handleDragOver(event) {
        event.preventDefault();
      }

    return (
      <div className="container">
          <div className="row">
            <div className='col-12'>
                <Link className='btn btn-primary mb-2 float-end' to={"/product/create"}>
                    Upload Video
                </Link>
            </div>
            <div className="col-12">
                <div className="card card-body">
                <div className="table-responsive">
                <table className="table table-bordered mb-0 text-center">
                    <thead>
                    <tr>
                        <th>Actions</th>
                        <th>size</th>
                        <th>video</th>
                    </tr>
                    </thead>
                    <tbody>
                  {products.length > 0 &&
                    products.map((row, key) => (
                      <tr key={key}>
                        <td>{row.title}</td>
                        <td>{row.size}</td>
                        <td>
                        <video
                            loop
                            autoPlay
                            width="75px"
                            draggable
                            onDragStart={(event) => {
                              event.dataTransfer.setData('text/plain', `http://localhost:8000/storage/product/video/${row.video}`);
                              event.dataTransfer.setData('size', row.size);
                            }}
                          >
                            <source
                              src={`http://localhost:8000/storage/product/video/${row.video}`}
                              type="video/mp4"
                            />
                          </video>
                        </td>
                        <td>
                          <Link to={`/product/edit/${row.id}`} 
                            className="btn btn-success me-2">
                            Edit
                          </Link>
                          <Button variant="danger" onClick={() =>
                            deleteProduct(row.id)}>
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                </tbody>
                </table>
                <div style={{ padding: '10px' }}>
                <div style={{ width: '100%' }}>
                    <div
                       className="drop-body"
                       id="drop-body"
                       onDrop={handleDrop}
                       onDragOver={handleDragOver}
                     >
                       {draggedVideo && (
                        <div>
                          <Draggable bounds = "#drop-body">
                            <video
                              loop
                              autoPlay width={draggedVideo.width} 
                              height={draggedVideo.height} src={draggedVideo.videoSrc} 
                              type="video/mp4">
                            </video>
                          </Draggable>
                        </div>
                      )}
                    </div>
                </div>
                </div>
                </div>
                </div>
            </div>
          </div>
      </div>
    )
}
