import React, { Component } from "react";
// import Row from "react-bootstrap/Row";
// import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
// import Button from "react-bootstrap/Button";

class Client extends Component {
  render() {
    return (
      <div className="container-fluid">
        <Form>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>User ID</Form.Label>
            <Form.Control type="email" placeholder="Enter User ID" />
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" />
          </Form.Group>
        </Form>
      </div>
    );
  }
}

export default Client;
