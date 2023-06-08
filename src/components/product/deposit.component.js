import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button'
import axios from 'axios';
import { useParams } from 'react-router-dom'

import './component.css'

export default function Deposit() {
    
    const [description, setDescription] = useState("")
    const [deposit, setDeposit] = useState("")
    const { id } = useParams()

    useEffect(() => {
        fetchAccount();
      }, []);

    const fetchAccount = async () => {
        await axios.get(`http://localhost:8000/api/products/${id}`).then(({data})=>{
          const { description, deposit } = data.product
          setDescription(description)
          setDeposit(deposit)
        })
      }

    return (
        <div className="col-12">
            <div className="card card-body">
                <div className="table-responsive">
                    <table className="table table-bordered mb-0 text-center">
                        <thead>
                            <tr>
                                <th>Account Number</th>
                                <th>Deposit</th>
                            </tr>
                        </thead>
                            <tbody>
                                <tr>
                                    <td>{description}</td>
                                    <td>$ {deposit}</td>
                                </tr>
                            </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}