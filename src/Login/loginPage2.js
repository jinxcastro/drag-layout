// import React, { useState } from 'react';
// // import AccountList from '../components/product/list.component';
// import './loginPage.css';
// import logoImage from './logo/lion.png';

// import {Form, Button, Col, Row} from 'react-bootstrap'
// import { useNavigate } from "react-router-dom";

// const LoginPage = () => {
//   const navigate = useNavigate();

//   const [userName, setUserName] = useState('');
//   const [password, setPassword] = useState('');

//   const handleUsername = (event) => {
//     setUserName(event.target.value);
//   };

//   const handlePassword = (event) => {
//     setPassword(event.target.value);
//   };

//   const redirectToAccountList = () => {
//     window.location.href = '/product/list/:id';
//   };

//   const redirectToUserLogin = () => {
//     navigate('./LoginForm');
//   };

//   const handleSubmit = (event) => {
//     event.preventDefault();

//     const embeddedName = 'jinxcastro';
//     const embeddedPassword = 'secret';

//     if (userName === embeddedName && password === embeddedPassword) {
//       redirectToAccountList();
//     } else {
//       alert('Invalid Username or Password');
//     }
//   };

//   return  (
//     <div className="login-container">
//       <img src={logoImage} alt="Logo" className="logo-image" />
//       <Form onSubmit={handleSubmit}>
//         <Row> 
//           <Col>
//             <Form.Group controlId="Name">
//             <Form.Control
//               type="text"
//               id="name"
//               placeholder='Username'
//               value={userName}
//               onChange={handleUsername}
//               className='username-input'
//             />
//             </Form.Group>
//           </Col>  
//         </Row>     
//         <Row> 
//           <Col>
//             <Form.Group controlId="Description">
//             <Form.Control
//               type="password"
//               id="password"
//               placeholder='Password'
//               value={password}
//               onChange={handlePassword}
//             />
//             </Form.Group>
//           </Col>  
//         </Row>
//         <Button className="login-btn" type="submit">
//           Banker Login
//         </Button> 
//         <Button onClick={redirectToUserLogin} className="login-btn" type="submit">
//           User Login
//         </Button> 
//         <div style={{ textAlign: 'right', marginTop: '10px' }}>
//         <a href="/RegistrationForm">Register now</a>
//       </div>
//       </Form>
//     </div>
//   );
// };

// export default LoginPage;