/* eslint-disable complexity */
/* eslint-disable default-case */
import React, { Component } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Terms from "./Terms";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelopeSquare } from "@fortawesome/free-solid-svg-icons";

const ContactSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  lastName: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  phone: Yup.string().min(10, "Invalid phone number"),
  email: Yup.string()
    .email("Invalid email")
    .required("Required"),
  message: Yup.string()
    .min(2, "Too Short!")
    .required("Required"),
  terms: Yup.boolean().oneOf([true], "Field must be checked")
});

class ContactForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      termsShow: false
    };
  }
  handleClose = () => {
    this.setState({ show: false });
    this.props.toggleLockNavigation();
  };
  handleShow = () => {
    this.setState({ show: true });
    this.props.toggleLockNavigation();
  };
  render() {
    return (
      <div>
        <Button variant="light" onClick={this.handleShow}>
          <FontAwesomeIcon icon={faEnvelopeSquare} size="4x" color="black" />
        </Button>

        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Contact App Age Technologies</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row noGutters>
              <Col>
                <Formik
                  initialValues={{
                    message: undefined,
                    firstName: undefined,
                    lastName: undefined,
                    email: undefined,
                    phone: undefined,
                    terms: false
                  }}
                  validationSchema={ContactSchema}
                  onSubmit={(values, actions) => {
                    // Send values to server API
                    axios
                      .post("/api/users/messages", values)
                      .then(message => {
                        actions.setSubmitting(false);
                        actions.resetForm({
                          message: "",
                          firstName: "",
                          lastName: "",
                          email: "",
                          phone: "",
                          terms: false
                        });
                        //setModalShow(true);
                      })
                      .catch(error => {
                        actions.setSubmitting(false);
                        actions.setErrors(error);
                        actions.setStatus({ msg: "Could not send message" });
                      });
                  }}
                  render={({
                    values,
                    errors,
                    status,
                    touched,
                    handleBlur,
                    handleChange,
                    handleSubmit,
                    isSubmitting
                  }) => (
                    <Form noValidate onSubmit={handleSubmit}>
                      <Form.Row>
                        <Form.Group
                          as={Col}
                          md="6"
                          controlId="validationFormik01"
                        >
                          <Form.Label>First name</Form.Label>
                          <Form.Control
                            type="text"
                            name="firstName"
                            placeholder="First name"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.firstName}
                            isValid={touched.firstName && !errors.firstName}
                            isInvalid={touched.firstName && !!errors.firstName}
                          />
                          <Form.Control.Feedback>
                            Looks good!
                          </Form.Control.Feedback>
                          <Form.Control.Feedback type="invalid">
                            {errors.firstName}
                          </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group
                          as={Col}
                          md="6"
                          controlId="validationFormik02"
                        >
                          <Form.Label>Last name</Form.Label>
                          <Form.Control
                            type="text"
                            name="lastName"
                            placeholder="Last name"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.lastName}
                            isValid={touched.lastName && !errors.lastName}
                            isInvalid={touched.lastName && !!errors.lastName}
                          />
                          <Form.Control.Feedback>
                            Looks good!
                          </Form.Control.Feedback>
                          <Form.Control.Feedback type="invalid">
                            {errors.lastName}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Form.Row>
                      <Form.Row>
                        <Form.Group
                          as={Col}
                          md="12"
                          controlId="validationCustomPhone"
                        >
                          <Form.Label>Phone number</Form.Label>
                          <InputGroup>
                            <InputGroup.Prepend>
                              <InputGroup.Text id="inputGroupPrepend">
                                #
                              </InputGroup.Text>
                            </InputGroup.Prepend>
                            <Form.Control
                              type="text"
                              name="phone"
                              placeholder="Phone number"
                              aria-describedby="inputGroupPrepend"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.phone}
                              isValid={touched.phone && !errors.phone}
                              isInvalid={touched.phone && !!errors.phone}
                            />
                            <Form.Control.Feedback>
                              Looks good!
                            </Form.Control.Feedback>
                            <Form.Control.Feedback type="invalid">
                              {errors.phone}
                            </Form.Control.Feedback>
                          </InputGroup>
                        </Form.Group>
                      </Form.Row>
                      <Form.Row>
                        <Form.Group
                          as={Col}
                          md="12"
                          controlId="validationCustomEmail"
                        >
                          <Form.Label>Email</Form.Label>
                          <InputGroup>
                            <InputGroup.Prepend>
                              <InputGroup.Text id="inputGroupPrepend">
                                @
                              </InputGroup.Text>
                            </InputGroup.Prepend>
                            <Form.Control
                              type="text"
                              name="email"
                              placeholder="Email"
                              aria-describedby="inputGroupPrepend"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.email}
                              isValid={touched.email && !errors.email}
                              isInvalid={touched.email && !!errors.email}
                            />
                            <Form.Control.Feedback>
                              Looks good!
                            </Form.Control.Feedback>
                            <Form.Control.Feedback type="invalid">
                              {errors.email}
                            </Form.Control.Feedback>
                          </InputGroup>
                        </Form.Group>
                      </Form.Row>
                      <Form.Row>
                        <Form.Group
                          as={Col}
                          md="12"
                          controlId="controlTextarea1"
                        >
                          <Form.Label>Message</Form.Label>
                          <Form.Control
                            as="textarea"
                            required
                            rows="5"
                            name="message"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.message}
                            isValid={touched.message && !errors.message}
                            isInvalid={touched.message && !!errors.message}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.message}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Form.Row>
                      <Form.Group>
                        <Form.Check
                          name="terms"
                          label={
                            <div>
                              Please agree to our{" "}
                              <span
                                style={{
                                  cursor: "pointer",
                                  textDecoration: "underline"
                                }}
                                onClick={() => {
                                  this.setState({ termsShow: true });
                                }}
                              >
                                terms and conditions
                              </span>
                            </div>
                          }
                          feedback={errors.terms}
                          onChange={handleChange}
                          isInvalid={touched.terms && !!errors.terms}
                          checked={values.terms}
                        />
                      </Form.Group>
                      <Button type="submit" disabled={isSubmitting}>
                        Send
                      </Button>
                    </Form>
                  )}
                />
              </Col>
            </Row>
          </Modal.Body>
        </Modal>
        {/* Renders the terms and privacy policy as a part of the contact form button */}
        <Terms
          show={this.state.termsShow}
          handleClose={() => this.setState({ termsShow: false })}
        />
      </div>
    );
  }
}

export default ContactForm;
