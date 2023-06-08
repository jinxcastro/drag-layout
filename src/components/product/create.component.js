import React, { useState } from "react";
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import axios from 'axios'
import Swal from 'sweetalert2';
import { useNavigate, Link, } from 'react-router-dom'

export default function CreateAccount() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [deposit, setDeposit] = useState("")
  const [status, setStatus] = useState('active')
  const [validationError,setValidationError] = useState({})

  const createAccount = async (e) => {
    e.preventDefault();

    const formData = new FormData()

    formData.append('title', title)
    formData.append('description', description)
    formData.append('deposit', deposit)
    formData.append('status', status)

    await axios.post(`http://localhost:8000/api/products`, formData).then(({data})=>{
      Swal.fire({
        icon:"success",
        text:data.message
      })
      navigate("/product/list/:id")
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

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-12 col-sm-12 col-md-6">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Add New Account</h4>
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
                <Form onSubmit={createAccount}>
                <Row> 
                  <Col>
                    <Form.Group controlId="Name">
                      <Form.Control
                        type="text"
                        value={title}
                        placeholder="Name"
                        onChange={(event) => {
                          setTitle(event.target.value);
                        }}
                      />
                    </Form.Group>
                  </Col>  
                </Row>
              <br/>
                <Row> 
                  <Col>
                    <Form.Group controlId="Description">
                      <Form.Control
                        type="text"
                        value={description}
                        placeholder="Account No"
                        maxLength={16}
                        onChange={(event) => {
                          setDescription(event.target.value);
                        }}
                      />
                    </Form.Group>
                  </Col>  
                </Row>
            <br/>
                <Row> 
                  <Col>
                    <Form.Group controlId="Deposit">
                      <Form.Control
                        type="text"
                        value={deposit}
                        placeholder="Deposit"
                        maxLength={16}
                        onChange={(event) => {
                          setDeposit(event.target.value);
                        }}
                      />
                    </Form.Group>
                  </Col>  
                </Row>
            <br/>
                <Button variant="primary" className="mt-2 float-end btn-add-acc" size="lg" block="block" type="submit">
                    Save
                </Button>           

                <Link to="/product/list/:id">
                    <Button className=" btn-cancel mt-2 float-start" size="lg" block="block">
                        Cancel
                    </Button>
                </Link>
                </Form>
                <div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}