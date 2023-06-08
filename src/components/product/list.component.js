import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {Button, Navbar} from 'react-bootstrap'
import axios from 'axios';
import Swal from 'sweetalert2'
// import {MoreVertIcon, Menu, MenuItem, anchorEl} from '@material-ui/icons/MoreVert';

import CIcon from '@coreui/icons-react'
import {
    CDropdown,
    CDropdownToggle,
    CDropdownMenu,
} from '@coreui/react'

import './component.css'

export default function List() {

    const [accounts, setAccounts] = useState([])
    const [searchAccount, setSearchAccount] = useState('');
      
    const filteredAccounts = accounts.filter((account) =>
        account.title.toLowerCase().includes(searchAccount.toLowerCase())
  );

    useEffect(()=>{
        fetchAccounts()     
    },[])

    const fetchAccounts = async () => {
        await axios.get(`http://localhost:8000/api/products`).then(({data})=>{
            setAccounts(data)
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
            fetchAccounts()
          }).catch(({response:{data}})=>{
            Swal.fire({
                text:data.message,
                icon:"error"
            })
          })
    }

    return (
        
      <div className="container">
            <div className="row">
                <div className='col-12 search-btn-row'>
                    <div className='float-start'>
                        <div className='input-group'>
                            <input
                                type='text'
                                className='form-control'
                                placeholder='Search Account...'
                                value={searchAccount}
                                onChange={(e) => setSearchAccount(e.target.value)}
                            />
                            <button className='btn btn-outline-secondary' type='button'> Search </button>
                        </div>
                    </div>
                    <div className='float-end'>
                        <Link className='btn btn-add-acc ms-2' to={"/product/create"}> Add New Account </Link>
                    </div>
                </div>

            <div className="col-12">
                <div className="card card-body">
                    <div className="table-responsive">
                        <table className="table table-bordered mb-0 text-center">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Account Number</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAccounts.length > 0 ? (
                                    filteredAccounts.map((row, key) => (
                                    <tr key={key}>
                                        <td>{row.title}</td>
                                        <td>{row.description}</td>
                                        <td>{row.status}</td>
                                        
                                        <td>
                                        <CDropdown>
                                            <CDropdownToggle color="secondary" />
                                            <CDropdownMenu>
                                                {row.status !== 'disabled' && (
                                                <Button
                                                    as={Link}
                                                    to={`/product/deposit/${row.id}`}
                                                    variant="primary"
                                                    className="deposit-button"
                                                >
                                                    Deposit
                                                </Button>
                                                )}

                                                <Button
                                                    as={Link}
                                                    to={`/product/edit/${row.id}`}
                                                    variant="primary"
                                                    className="edit-button"
                                                    >
                                                    Edit
                                                </Button>

                                                <Button
                                                    onClick={() => deleteProduct(row.id)}
                                                    variant="danger"
                                                    className="delete-button"
                                                    >
                                                    Delete
                                                </Button>
                                            </CDropdownMenu>
                                            </CDropdown>
                                        </td>
                                    </tr>
                                    ))
                                ) : (
                                    <tr>
                                    <td colSpan='4'>No matching account found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}