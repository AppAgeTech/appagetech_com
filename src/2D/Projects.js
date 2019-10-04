import React, { Component } from "react";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Carousel from "react-bootstrap/Carousel";
import BerlandDetail from "./BerlandDetail";
import TodaysIposDetail from "./TodaysIposDetail";

class Projects extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showBerlandDetail: false,
      showTodaysIposDetail: false,
      isHovered: false
    };
  }

  onClickBerland = e => {
    e.preventDefault();
    this.setState({ showBerlandDetail: true });
  };
  onClickTodaysIpos = e => {
    e.preventDefault();
    this.setState({ showTodaysIposDetail: true });
  };

  handleHover = () => {
    this.setState(prevState => ({
      isHovered: !prevState.isHovered
    }));
  };

  render() {
    const berlandPics = [
      // "images/berlandAnimations/ScreenShots_Berland-width-525-8-Overlay.png",
      "images/berlandAnimations/ScreenShots_Berland-width-525-OverlayWhite.png",
      "images/berlandAnimations/ScreenShots_Berland-width-525-1.png",
      "images/berlandAnimations/ScreenShots_Berland-width-525-2.png",
      "images/berlandAnimations/ScreenShots_Berland-width-525-3.png",
      "images/berlandAnimations/ScreenShots_Berland-width-525-4.png",
      "images/berlandAnimations/ScreenShots_Berland-width-525-5.png",
      "images/berlandAnimations/ScreenShots_Berland-width-525-6.png",
      "images/berlandAnimations/ScreenShots_Berland-width-525-7.png"
    ];

    const todaysPics = [
      // "images/todaysIposAnimation/ScreenShots_TodaysIpos_width525-7-overlay.png",
      "images/todaysIposAnimation/ScreenShots_TodaysIpos_525-overlayWhite.png",
      "images/todaysIposAnimation/ScreenShots_TodaysIpos_width525-1.png",
      "images/todaysIposAnimation/ScreenShots_TodaysIpos_width525-2.png",
      "images/todaysIposAnimation/ScreenShots_TodaysIpos_width525-3.png",
      "images/todaysIposAnimation/ScreenShots_TodaysIpos_width525-4.png",
      "images/todaysIposAnimation/ScreenShots_TodaysIpos_width525-5.png"
    ];

    const windowAspect = window.innerWidth / window.innerHeight;

    const variableWidth = windowAspect > 1 ? 535 : 420;

    const variableMarginTop = windowAspect > 1 ? 100 : 240;

    const overlayIndex = !this.state.isHovered ? undefined : 0;

    return (
      <div>
        <BerlandDetail show={this.state.showBerlandDetail} onHide={() => this.setState({ showBerlandDetail: false })} />
        <TodaysIposDetail
          show={this.state.showTodaysIposDetail}
          onHide={() => this.setState({ showTodaysIposDetail: false })}
        />
        <Container style={{ marginTop: variableMarginTop }}>
          <Row className="justify-content-center">
            <Col md={6} style={{ width: variableWidth, marginBottom: 25 }}>
              <Carousel
                pauseOnHover={false}
                interval={1500}
                controls={false}
                indicators={false}
                fade={true}
                className="shadow"
                onClick={this.onClickBerland}
                activeIndex={overlayIndex}
                onMouseEnter={this.handleHover}
                onMouseLeave={this.handleHover}
              >
                {berlandPics.map(imgSrc => (
                  <Carousel.Item key={imgSrc}>
                    <img src={imgSrc} alt="" style={{ width: variableWidth }} />
                  </Carousel.Item>
                ))}
              </Carousel>
            </Col>
            <Col md={6} style={{ width: variableWidth }}>
              <Carousel
                pauseOnHover={false}
                interval={1500}
                controls={false}
                indicators={false}
                fade={true}
                className="shadow"
                onClick={this.onClickTodaysIpos}
                activeIndex={overlayIndex}
                onMouseEnter={this.handleHover}
                onMouseLeave={this.handleHover}
              >
                {todaysPics.map(imgSrc => (
                  <Carousel.Item key={imgSrc}>
                    <img src={imgSrc} alt="" style={{ width: variableWidth }} />
                  </Carousel.Item>
                ))}
              </Carousel>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Projects;
