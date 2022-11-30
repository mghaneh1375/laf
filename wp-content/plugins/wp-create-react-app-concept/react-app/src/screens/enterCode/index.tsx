import React from 'react'
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { Link, useHistory, useLocation } from 'react-router-dom'
import { useUser } from 'store/userStore'
import {getErrorMessage} from "../../lib/handy";

const EnterCodeScreen = () => {

    //states
    const [isFormSubmitting, setIsFormSubmitting] = React.useState<boolean>(false)
    const { verifyPhone, temporaryPhone } = useUser()
    const { state } = useLocation<{nextPathname: string}>()
    const history = useHistory()
    const { t } = useTranslation()

    //references
    const enteredCode = React.useRef<string>()

    React.useEffect(() => {
        if (temporaryPhone == undefined) {
            history.replace({ pathname: '/signup' })
        }
    }, [])

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        event.stopPropagation();

        if (enteredCode.current) {
            setIsFormSubmitting(true)
            verifyPhone(enteredCode.current)
                .then(() => {
                    history.replace({ pathname: state?.nextPathname || "/" })
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
                                Enter the code
                            </h1>
                        </Form.Group>
                        <Form.Group >
                            <Form.Text className="text-muted">
                                 We've just sent you the code through your email, Please enter the code here
                            </Form.Text>
                        </Form.Group>
                        <Form onSubmit = { handleSubmit }>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>Received code <span className="required">*</span></Form.Label>
                                <Form.Control
                                    required
                                    type="text" placeholder="enter your code here"
                                    onChange = { e => enteredCode.current = e.target.value }/>
                            </Form.Group>
                            <div className="centered form-group">
                                <Button disabled = { isFormSubmitting } variant="primary" type="submit">
                                    Submit
                                </Button>
                            </div>
                            <div className='centered'>
                                <p>Haven't received the code yet? <Link to='/forgetpass'>re-enter mobile number</Link></p>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    </Container>
}

export default EnterCodeScreen
