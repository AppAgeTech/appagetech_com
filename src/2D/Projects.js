import React, { Component } from "react";
import BerlandDetail from "./BerlandDetail";
import TodaysIposDetail from "./TodaysIposDetail";
import posed from "react-pose";
import SplitText from "react-pose-text";
import { linear } from "@popmotion/easing";

const Box = posed.div({
  hoverable: true,
  pressable: true,
  init: {
    scale: 1,
    boxShadow: "0px 0px 3px rgba(0,0,0,0.1)",
    color: "white"
  },
  hover: {
    scale: 1.2,
    boxShadow: "0px 5px 10px rgba(0,0,0,0.3)"
  },
  press: {
    scale: 1.1,
    boxShadow: "0px 2px 5px rgba(0,0,0,0.2)"
  }
});
const charPoses = {
  exit: { opacity: 0, y: 20 },
  enter: {
    opacity: 1,
    y: 0,
    delay: ({ charIndex }) => charIndex * 100
  }
};

const Container = posed.div({
  hueRotate: {
    "--color": true,
    transition: () => ({
      type: "keyframes",
      values: ["#198FE3", "#FF1C68", "#9B65DE"],
      duration: 10000,
      ease: linear,
      loop: Infinity
    })
  }
});

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
    const windowAspect = window.innerWidth / window.innerHeight;
    const variableWidth = windowAspect > 1 ? 250 : 200;
    const variableMarginTop = windowAspect > 1 ? -300 : -300;
    const variableFontSize = windowAspect > 1 ? 24 : 22;

    return (
      <div>
        <BerlandDetail
          show={this.state.showBerlandDetail}
          onHide={() => this.setState({ showBerlandDetail: false })}
        />
        <TodaysIposDetail
          show={this.state.showTodaysIposDetail}
          onHide={() => this.setState({ showTodaysIposDetail: false })}
        />
        <div
          className="container"
          style={{
            marginTop: variableMarginTop,
            padding: 0,
            marginLeft: 0,
            marginRight: 0
          }}
        >
          <div className="row justify-content-center">
            <Container
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                "--color": 0x14d790
              }}
              initialPose="none"
              pose="hueRotate"
            >
              <Box
                className="box"
                onPressStart={this.onClickBerland}
                style={{
                  // background: "#fa424a",
                  borderRadius: "30px",
                  borderColor: "black",
                  borderWidth: "4px",
                  width: variableWidth,
                  height: variableWidth,
                  margin: 10,
                  display: "flex",
                  alignItems: "center",
                  background: "var(--color)",
                  transformOrigin: "50% 50%"
                }}
              >
                <div className="container">
                  <div className="row justify-content-center">
                    <div style={{ fontSize: variableFontSize }}>
                      <SplitText
                        initialPose="exit"
                        pose="enter"
                        charPoses={charPoses}
                      >
                        toddberland.com
                      </SplitText>
                    </div>
                  </div>
                </div>
              </Box>

              <Box
                className="box"
                onPressStart={this.onClickTodaysIpos}
                style={{
                  background: "#208BC7",
                  borderRadius: "30px",
                  borderColor: "black",
                  borderWidth: "4px",
                  width: variableWidth,
                  height: variableWidth,
                  margin: 10,
                  display: "flex",
                  alignItems: "center"
                }}
              >
                <div className="container">
                  <div className="row justify-content-center">
                    <div style={{ fontSize: variableFontSize }}>
                      <SplitText
                        initialPose="exit"
                        pose="enter"
                        charPoses={charPoses}
                      >
                        todaysipos.com
                      </SplitText>
                    </div>
                  </div>
                </div>
              </Box>
            </Container>
          </div>
        </div>
      </div>
    );
  }
}

export default Projects;
