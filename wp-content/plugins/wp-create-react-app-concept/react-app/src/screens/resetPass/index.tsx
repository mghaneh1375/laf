import React from 'react'
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import { useUser } from 'store/userStore'
import PasswordField from 'components/passwordField'
import {getErrorMessage} from "../../lib/handy";

const ResetPassScreen = () => {

    //hooks
    const history = useHistory()
    const { t } = useTranslation()
    const { resetPassword } = useUser()

    //states
    const [isSubmitting, setisSubmitting] = React.useState<boolean>(false)
    const [isFormValidated, setIsFormValidated] = React.useState<boolean>(false)

    //references
    const enteredVerificationCode = React.useRef<string>()
    const enteredNewPassword = React.useRef<string>()

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        event.stopPropagation();

        if (enteredVerificationCode.current == undefined ||
            enteredVerificationCode.current.length == 0 ||
            enteredNewPassword.current == undefined ||
            enteredNewPassword.current.length == 0
            ) {
            setIsFormValidated(true)
            return
        }

        setisSubmitting(true)
        toast.promise(
            resetPassword({ newPass: enteredNewPassword.current, verifyCode: enteredVerificationCode.current })
            .then(() => {
                history.push({
                    pathname: '/login'
                })
            })
            .finally(() => setisSubmitting(false)),
            {
              loading: 'Loading',
              success: () => `Successfully your password has been reset`,
              error: (e) => getErrorMessage(e),
        })
    }


    return <Container>
        <Row>
            <Col md = {{ span: 6, offset: 3 }}>
                <Form.Group />
                    <Card>
                        <Card.Body>
                            <Form.Group >
                                <h1 className='centered'>
                                    Reset Password
                                </h1>
                            </Form.Group>
                            <Form.Group >
                                <Form.Text className="text-muted">
                                    Enter the code you've received and enter a new password to reset your previous password
                                </Form.Text>
                            </Form.Group>
                            <Form validated = { isFormValidated } onSubmit = { handleSubmit }>
                                <Form.Group controlId="resetPassPassword">
                                    <Form.Label>Verification Code <span className="required">*</span></Form.Label>
                                    <Form.Control
                                        required
                                        onChange = { e => enteredVerificationCode.current = e.target.value }
                                        type="text" placeholder="Verification Code" />
                                    <Form.Control.Feedback type='invalid'>Please enter the code you've received</Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group controlId="resetPassPassword">
                                    <Form.Label>New Password <span className="required">*</span></Form.Label>
                                    <PasswordField
                                        name='password'
                                        required = { true }
                                        onChange = { e => enteredNewPassword.current = e.target.value }
                                        placeholder="Password"/>
                                    <Form.Control.Feedback type='invalid'>Please enter a valid password</Form.Control.Feedback>
                                </Form.Group>
                                <div className="centered form-group">
                                    <Button disabled = { isSubmitting } variant="primary" type="submit">
                                        Submit
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
            </Col>
        </Row>
    </Container>
}

export default ResetPassScreen
