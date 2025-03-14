import * as React from "react";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "bootstrap/dist/css/bootstrap.css";

import { BrowserRouter as Router , Routes, Route, Link } from "react-router-dom";
import DragLayout from "./Login/dragLayout";

function App() {
  return (<Router>
    <Navbar bg="primary">
      <Container>
        <h1 className="navbar-brand text-white">Github Page</h1>
      </Container>
    </Navbar>

    <Container className="mt-5">
      <Row>
        <Col md={12}>
          <Routes>
            <Route exact path='/' element={<DragLayout />} />
            <Route path="/drag-layout" element={<DragLayout />} />
          </Routes>
        </Col>
      </Row>
    </Container>
  </Router>);
}

export default App;

