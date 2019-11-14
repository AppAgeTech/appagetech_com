import React, { Component, Fragment } from "react";
import posed, { PoseGroup } from "react-pose";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";
import Figure from "react-bootstrap/Figure";
import ContactForm from "./ContactForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitterSquare } from "@fortawesome/free-brands-svg-icons";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import { faFacebookSquare } from "@fortawesome/free-brands-svg-icons";
import { faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { faAt } from "@fortawesome/free-solid-svg-icons";

const Modal = posed.div({
  enter: {
    y: 0,
    opacity: 1,
    delay: 1000,
    transition: {
      y: { type: "spring", stiffness: 1000, damping: 15 },
      default: { duration: 1000 }
    }
  },
  exit: {
    y: 100,
    opacity: 0,
    transition: { duration: 150 }
  }
});

const AnimatedHover = posed.div({
  hoverable: true,
  pressable: true,
  init: {
    scale: 1,
    boxShadow: "0px 0px 0px rgba(0,0,0,0)"
  },
  hover: {
    scale: 1.2,
    boxShadow: "0px 5px 10px rgba(0,0,0,0.2)"
  },
  press: {
    scale: 1.1,
    boxShadow: "0px 2px 5px rgba(0,0,0,0.1)"
  }
});

class Contact extends Component {
  constructor(props) {
    super(props);
    this.state = { isVisible: false, open: false };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        isVisible: !this.state.isVisible
      });
    }, 700);
    setTimeout(2800);
  }

  toggle = () => this.setState({ isVisible: !this.state.isVisible });

  render() {
    const windowAspect = window.innerWidth / window.innerHeight;
    const marginTop = windowAspect > 1 ? -300 : -300;

    const { isVisible } = this.state;
    const { open } = this.state;

    return (
      <Fragment>
        <PoseGroup>
          {isVisible && (
            // If animating more than one child, each needs a `key`
            <Modal
              key="modal"
              style={{
                marginTop: marginTop,
                flexDirection: "column"
              }}
            >
              <Row style={{ width: 500, backgroundColor: "red" }}></Row>
              <Row className="justify-content-center mb-3">
                <Col
                  style={{
                    margin: 0
                  }}
                >
                  <Figure
                    style={{
                      paddingTop: 35,
                      border: "3px solid",
                      borderRadius: 20,
                      height: 380,
                      width: 220
                    }}
                  >
                    <Row className="justify-content-center mb-3">
                      <Image
                        src="images/Will_SlackProfilePic.jpg"
                        roundedCircle
                        width="170px"
                        height="170px"
                        style={{ border: "4px solid" }}
                        onClick={() => this.setState({ open: !open })}
                      ></Image>
                    </Row>
                    <Row className="justify-content-center mb-1">
                      <h4>William Griffin</h4>
                    </Row>
                    <Row className="justify-content-center mb-3">
                      <i>Los Angeles, California</i>
                    </Row>
                    <Row style={{ marginLeft: 0, padding: 0 }}>
                      <Col>
                        <AnimatedHover style={{ width: 50, height: 50 }}>
                          <Button
                            href={`mailto:william@appagetech.com`}
                            target="_blank"
                            variant="light"
                          >
                            <FontAwesomeIcon
                              icon={faAt}
                              size="3x"
                              color="black"
                            />
                          </Button>
                        </AnimatedHover>
                      </Col>
                      <Col>
                        <AnimatedHover style={{ width: 50, height: 50 }}>
                          <Button
                            href="https://www.linkedin.com/in/williamandrewgriffin/"
                            target="_blank"
                            variant="light"
                          >
                            <FontAwesomeIcon
                              icon={faLinkedin}
                              size="3x"
                              color="black"
                            />
                          </Button>
                        </AnimatedHover>
                      </Col>
                    </Row>
                  </Figure>
                </Col>

                <Col
                  style={{
                    margin: 0
                  }}
                >
                  <Figure
                    style={{
                      paddingTop: 35,
                      border: "3px solid",
                      borderRadius: 20,
                      height: 380,
                      width: 220
                    }}
                  >
                    <Row className="justify-content-center mb-3">
                      <Image
                        src="images/Preston_BW_profilePic2.jpg"
                        roundedCircle
                        width="170px"
                        height="170px"
                        style={{ border: "4px solid" }}
                        onClick={() => this.setState({ open: !open })}
                      ></Image>
                    </Row>
                    <Row className="justify-content-center mb-1">
                      <h4>Preston Chaplin</h4>
                    </Row>
                    <Row className="justify-content-center mb-3">
                      <i>New York, New York</i>
                    </Row>
                    <Row style={{ marginLeft: 0, padding: 0 }}>
                      <Col>
                        <AnimatedHover style={{ width: 50, height: 50 }}>
                          <Button
                            href={`mailto:preston@appagetech.com`}
                            target="_blank"
                            variant="light"
                          >
                            <FontAwesomeIcon
                              icon={faAt}
                              size="3x"
                              color="black"
                            />
                          </Button>
                        </AnimatedHover>
                      </Col>
                      <Col>
                        <AnimatedHover style={{ width: 50, height: 50 }}>
                          <Button
                            href="https://www.linkedin.com/in/prestonchaplin/"
                            target="_blank"
                            variant="light"
                          >
                            <FontAwesomeIcon
                              icon={faLinkedin}
                              size="3x"
                              color="black"
                            />
                          </Button>
                        </AnimatedHover>
                      </Col>
                    </Row>
                  </Figure>
                </Col>
              </Row>

              <Row
                style={{ width: 500 }}
                className="justify-content-center mb-2"
              >
                send App Age a message
              </Row>
              <Row className="justify-content-center mb-4">
                <AnimatedHover style={{ width: 75, height: 75 }}>
                  <ContactForm
                    toggleLockNavigation={this.props.toggleLockNavigation}
                  />
                </AnimatedHover>
              </Row>
              <Row className="justify-content-center mb-2">
                follow App Age on social media
              </Row>
              <Row style={{ marginLeft: 20, padding: 0 }}>
                <Col>
                  <AnimatedHover style={{ width: 75, height: 75 }}>
                    <Button
                      href="https://www.instagram.com/appagetechnologies/"
                      target="_blank"
                      variant="light"
                    >
                      <FontAwesomeIcon
                        icon={faInstagram}
                        size="4x"
                        color="black"
                      />
                    </Button>
                  </AnimatedHover>
                </Col>
                <Col>
                  <AnimatedHover style={{ width: 75, height: 75 }}>
                    <Button
                      href="https://twitter.com/age_app"
                      target="_blank"
                      variant="light"
                    >
                      <FontAwesomeIcon
                        icon={faTwitterSquare}
                        size="4x"
                        color="black"
                      />
                    </Button>
                  </AnimatedHover>
                </Col>
                <Col>
                  <AnimatedHover style={{ width: 75, height: 75 }}>
                    <Button
                      href="https://www.facebook.com/App-Age-Technologies-109527830463591/?modal=admin_todo_tour"
                      target="_blank"
                      variant="light"
                    >
                      <FontAwesomeIcon
                        icon={faFacebookSquare}
                        size="4x"
                        color="black"
                      />
                    </Button>
                  </AnimatedHover>
                </Col>
              </Row>
            </Modal>
          )}
        </PoseGroup>
      </Fragment>
    );
  }
}
export default Contact;
