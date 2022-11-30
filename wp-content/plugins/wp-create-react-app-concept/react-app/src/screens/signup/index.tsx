import React from 'react'
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import PhoneInput from 'react-phone-input-2'
import { Link, useHistory, useLocation } from 'react-router-dom'
import { useUser } from 'store/userStore'
import PasswordField from 'components/passwordField'
import {getErrorMessage} from "../../lib/handy";

const SignUp = () => {

    //hooks
    const { register } = useUser()
    const { state } = useLocation<{nextPathname: string}>()
    const history = useHistory()

    //states
    const [isFormValidated, setIsFormValidated] = React.useState<boolean>(false)
    const [isFormSubmitting, setIsFormSubmitting] = React.useState<boolean>(false)

    //references
    const enteredFullName = React.useRef<string>()
    const enteredEmail = React.useRef<string>()
    const enteredPhone = React.useRef<string>()
    const enteredPass = React.useRef<string>()

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsFormValidated(true)

        if (enteredPhone.current != undefined &&
            enteredPass.current != undefined) {
            setIsFormSubmitting(true)
            register({
                full_name: enteredFullName.current != undefined ? enteredFullName.current : '',
                mobile: enteredPhone.current,
                email: enteredEmail.current,
                password: enteredPass.current
            })
            .then(() => {
                history.push({
                    pathname: '/enter-code',
                    state: state && state.nextPathname ? { nextPathname: state.nextPathname } : undefined
                })
            })
            .catch((e) => {
                toast.error(getErrorMessage(e))
            }).finally(() => {
                setIsFormSubmitting(false)
            })
        }
    }

    return <Container>
        <Row>
            <Col md = {{ span: 6, offset: 3 }}>
                <Form.Group />
                <Card>
                    <Card.Body>
                        <Form.Group >
                            <h1 className='centered'>
                                Sign Up
                            </h1>
                        </Form.Group>
                        <Form noValidate validated = { isFormValidated } onSubmit = { handleSubmit }>
                            <Form.Group controlId="signUpFullName">
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    className="capitalize"
                                    type="text" placeholder="Name"
                                    onChange = { e => enteredFullName.current = e.target.value }/>
                            </Form.Group>
                            <Form.Group controlId="signUpEmail">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control
                                    type="email" placeholder="Enter email"
                                    onChange = { e => enteredEmail.current = e.target.value }/>
                                <Form.Text className="text-muted">

                                </Form.Text>
                            </Form.Group>
                            <Form.Group controlId="signUpEmail">
                                <Form.Label>Mobile Number <span className="required">*</span></Form.Label>
                                <PhoneInput
                                    country = { 'gb' }
                                    onlyCountries = {[ 'ie', 'ch', 'no', 'gb' ]}
                                    inputClass = 'phone-input-form-control'
                                    countryCodeEditable={false}
                                    onChange = { value => enteredPhone.current = value }
                                    inputProps={{
                                        name: 'phone',
                                        required: true,
                                        autoFocus: false
                                    }}
                                />
                                {  <Form.Control.Feedback type='invalid'>Please enter a valid mobile number</Form.Control.Feedback>}
                                <Form.Text className="text-muted">

                                </Form.Text>
                            </Form.Group>
                            <Form.Group controlId="signUpPassword">
                                <Form.Label>Password <span className="required">*</span></Form.Label>
                                <PasswordField
                                        name='password'
                                        required = { true }
                                        onChange = { e => enteredPass.current = e.target.value }
                                        placeholder="Password"/>
                                <Form.Control.Feedback type='invalid'>Please enter a valid password</Form.Control.Feedback>
                            </Form.Group>
                            <div className="centered form-group">
                                <Button disabled = { isFormSubmitting } variant="primary" type="submit">
                                    Submit
                                </Button>
                            </div>
                            <div className='centered'>
                                <p>Already have an account? <Link to='/login'>Login</Link></p>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    </Container>
}

export default SignUp
