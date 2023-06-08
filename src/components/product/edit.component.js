import React, { useEffect, useState } from "react";
import Form from 'react-bootstrap/Form'
import {Button, ButtonGroup} from 'react-bootstrap';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useNavigate, useParams, Link } from 'react-router-dom'
import axios from 'axios';
import Swal from 'sweetalert2';

export default function EditUser() {
  const navigate = useNavigate();

  const { id } = useParams()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [deposit, setDeposit] = useState("")
  const [status, setStatus] = useState("")

  const [validationError,setValidationError] = useState({})

  useEffect(()=>{
    fetchAccount()
  },[])

  const fetchAccount = async () => {
    await axios.get(`http://localhost:8000/api/products/${id}`).then(({data})=>{
      const { title, description, deposit } = data.product
      setTitle(title)
      setDescription(description)
      setDeposit(deposit)
      setStatus(status)
    }).catch(({response:{data}})=>{
      Swal.fire({
        text:data.message,
        icon:"error"
      })
    })
  }

  const updateAccount = async (e) => {
    e.preventDefault();

    const formData = new FormData()
    formData.append('_method', 'PATCH');
    formData.append('title', title)
    formData.append('description', description)
    formData.append('deposit', deposit)
    formData.append('status', status)

    await axios.post(`http://localhost:8000/api/products/${id}`, formData).then(({data})=>{
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
              <h4 className="card-title">Update Account</h4>
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
                <Form onSubmit={updateAccount}>
                  <Row> 
                      <Col>
                        <Form.Group controlId="Name">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" maxLength={16} value={title} onChange={(event)=>{
                              setTitle(event.target.value)
                            }}/>
                        </Form.Group>
                      </Col>  
                  </Row>
                  <Row className="my-3">
                      <Col>
                        <Form.Group controlId="Description">
                            <Form.Label>Account Number</Form.Label>
                            <Form.Control type="text" maxLength={16} value={description} onChange={(event)=>{
                              setDescription(event.target.value)
                            }}/>
                        </Form.Group>
                      </Col>
                  </Row>
                  <Row className="my-3">
                      <Col>
                        <Form.Group controlId="Deposit">
                            <Form.Label>Deposit</Form.Label>
                            <Form.Control type="text" maxLength={16} value={deposit} onChange={(event)=>{
                              setDeposit(event.target.value)
                            }}/>
                        </Form.Group>
                      </Col>
                  </Row>
                  <Row> 
                  <Col>
                    <Form.Group controlId="Status">
                      <ButtonGroup>
                        <Button
                          variant={status === 'active' ? 'primary' : 'outline-primary'}
                          onClick={() => setStatus('active')}
                        >
                          Active
                        </Button>
                        <Button
                          variant={status === 'disabled' ? 'primary' : 'outline-primary'}
                          onClick={() => setStatus('disabled')}
                        >
                          Disabled
                        </Button>
                      </ButtonGroup>
                    </Form.Group>
                  </Col>  
                </Row>
                  <Button className="mt-2 btn-add-acc float-end" size="lg" block="block" type="submit">
                    Update
                  </Button>
                  <Link to="/product/list/:id">
                    <Button className="btn-cancel mt-2 float-start" size="lg" block="block">
                        Cancel
                    </Button>
                </Link>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}