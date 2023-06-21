import React, { useState } from "react";
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from 'axios'
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom'

export default function CreateProduct() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("")
  const [video, setVideo] = useState()
  const [size, setSize] = useState("");
  const [validationError,setValidationError] = useState({})

  const changeVideoHandler = (event) => {
    setVideo(event.target.files[0]);
  };

  const createProduct = async (e) => {
    e.preventDefault();

    const formData = new FormData()

    formData.append("title", title);
    formData.append("video", video);
    formData.append("size", size);

    await axios.post(`http://localhost:8000/api/products`, formData).then(({data})=>{
      Swal.fire({
        icon:"success",
        text:data.message
      })
      navigate("/")
    }).catch(({response})=>{
      if(response.status===422){
        setValidationError(response.data.errors)
      }else{
        Swal.fire({
          text:response.data.message,
          icon:"error"
        })
      }
    })
  }

  const getScreenSizeDimensions = () => {
    switch (size) {
      case "small":
        return { height: 200, width: 100 };
      case "medium":
        return { height: 300, width: 200 };
      case "large":
        return { height: 400, width: 300 };
      default:
        return { height: 0, width: 0 };
    }
  };

  const { height, width } = getScreenSizeDimensions();

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-12 col-sm-12 col-md-6">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Upload Video</h4>
              <hr />
              <div className="form-wrapper">
                {
                  Object.keys(validationError).length > 0 && (
                    <div className="row">
                      <div className="col-12">
                        <div className="alert alert-danger">
                          <ul className="mb-0">
                            {
                              Object.entries(validationError).map(([key, value])=>(
                                <li key={key}>{value}</li>   
                              ))
                            }
                          </ul>
                        </div>
                      </div>
                    </div>
                  )
                }
                <Form onSubmit={createProduct}>
                  <Row>
                    <Col>
                      <Form.Group controlId="Name">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                          type="text"
                          value={title}
                          onChange={(event) => {
                            setTitle(event.target.value);
                          }}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Form.Group controlId="Video" className="mb-3">
                        <Form.Label>Video</Form.Label>
                        <Form.Control type="file" onChange={changeVideoHandler} />
                      </Form.Group>
                    </Col>
                  </Row>
<Row>
  <Col>
    <Form.Group controlId="Size" className="mb-3">
      <Form.Label>Screen Size</Form.Label>
      <div>
        <Form.Check
          type="radio"
          label="Small"
          name="size"
          value="small"
          checked={size === "small"}
          onChange={(event) => {
            setSize(event.target.value);
          }}
        />
        <Form.Check
          type="radio"
          label="Medium"
          name="size"
          value="medium"
          checked={size === "medium"}
          onChange={(event) => {
            setSize(event.target.value);
          }}
        />
        <Form.Check
          type="radio"
          label="Large"
          name="size"
          value="large"
          checked={size === "large"}
          onChange={(event) => {
            setSize(event.target.value);
          }}
        />
      </div>
    </Form.Group>
  </Col>
</Row>

                  <Row>
                    <Col>
                      <div>
                        <strong>Screen Size Dimensions:</strong>
                        <br />
                        Height: {height}
                        <br />
                        Width: {width}
                      </div>
                    </Col>
                  </Row>
                  <Button variant="primary" className="mt-2" size="lg" block="block" type="submit">
                    Save
                  </Button>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
