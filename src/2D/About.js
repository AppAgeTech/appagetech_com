import React, { Component } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

class About extends Component {
  render() {
    return (
      <div className="container">
        <Row className="justify-content-center">
          <Col xs={10} className="align-items-center">
            <Row className="mb-5"></Row>
            <Row>
              <strong style={{ textIndent: 25, fontSize: 24 }}>
                We design software applications to breakthrough technological problems of our clients. Our solutions
                overcome these problems as full-service products—technology pillars fully integrated in to the larger
                business. From microsites to distributed mobile apps, we enjoy working on all types of problems. Our
                clients come to us looking for creative, novel solutions. And, our goal is to answer these problems in a
                way that surprises.
              </strong>
            </Row>
          </Col>
        </Row>
      </div>
    );
  }
}

export default About;
