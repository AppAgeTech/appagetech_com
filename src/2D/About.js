import React, { Component } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

class About extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <Container>
        <Row>
          <Col>
            <h4>What We Do</h4>
            <p style={{ textIndent: 25 }}>
              We design and produce applications that solve problems. Our
              solutions are based in process automation, data democracy, and web
              presence expansion. From microsites to distributed mobile apps, we
              enjoy working with individuals looking for creative and unique
              solutions. Our goal is to produce software solutions that are
              visually impressive and extremely usable.
            </p>
            <h4>Who We Are</h4>
            <p>Preston Chaplin, Co-Founder…</p>
            <p>William Griffin, Co-Founder…</p>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default About;
