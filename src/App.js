// import * as React from "react";
// import Navbar from "react-bootstrap/Navbar";
// import Container from "react-bootstrap/Container";
// import Row from "react-bootstrap/Row";
// import Col from "react-bootstrap/Col";
// import "bootstrap/dist/css/bootstrap.css";
// import { FaArrowRight } from 'react-icons/fa';
// import './App.css'

// import { BrowserRouter as Router , Routes, Route, Link, useLocation } from "react-router-dom";

// import EditAccount from "./components/product/edit.component";
// import AccountList from "./components/product/list.component";
// import CreateAccount from "./components/product/create.component";
// import DragLayout from "./Login/dragLayout";

// function App() {
//   return (
//     <Router>
//       <MainPage />
//     </Router>
//   );
// }

// function MainPage() {
//   const location = useLocation();
//   // const showNavbar = location.pathname !== "/";

//   return (
//     <>
//       {/* {showNavbar && (  */}
//         <Navbar className="navbar-header">
//           <Container>
//             <Link to={"/product/list/:id"} className="navbar-brand text-white">
//               <strong>Drag Layout</strong>
//             </Link>
//             {/* <div className="ml-auto">
//               <Link to={"/"} className="btn navbar-header">
//                 Welcome Banker <FaArrowRight />
//               </Link>
//             </div> */}
//           </Container>
//         </Navbar>
//       {/* )} */}

//       <Container className="mt-5">
//         <Row>
//           <Col md={12}>
//             <Routes>
//               <Route path="/product/create" element={<CreateAccount />} />
//               <Route path="/product/edit/:id" element={<EditAccount />} />
//               <Route path="/product/list/:id" element={<AccountList />} />
//               <Route exact path='/' element={<DragLayout />} />
//             </Routes>
//           </Col>
//         </Row>
//       </Container>
//     </>
//   );
// }

// export default App;

import * as React from "react";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "bootstrap/dist/css/bootstrap.css";

import { BrowserRouter as Router , Routes, Route, Link } from "react-router-dom";

import EditProduct from "./components/product/edit.component";
import ProductList from "./components/product/list.component";
import CreateProduct from "./components/product/create.component";

function App() {
  return (<Router>
    <Navbar bg="primary">
      <Container>
        <Link to={"/"} className="navbar-brand text-white">
          Basic Crud App
        </Link>
      </Container>
    </Navbar>

    <Container className="mt-5">
      <Row>
        <Col md={12}>
          <Routes>
            <Route path="/product/create" element={<CreateProduct />} />
            <Route path="/product/edit/:id" element={<EditProduct />} />
            <Route exact path='/' element={<ProductList />} />
          </Routes>
        </Col>
      </Row>
    </Container>
  </Router>);
}

export default App;

