import React from 'react'
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap'
import PhoneInput from 'react-phone-input-2'
import toast from 'react-hot-toast';
import { useUser } from 'store/userStore';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {getErrorMessage} from "../../lib/handy";

const ForgetPass = () => {

    const history = useHistory()
    const { t } = useTranslation()
    const { forgetPass } = useUser()

    const [isSubmitting, setisSubmitting] = React.useState<boolean>(false)
    const enteredPhone = React.useRef<string>()

    React.useEffect(() => {

        if(window.localStorage.TokenStorageKey !== undefined &&
            window.localStorage.TokenStorageKey != null &&
            window.localStorage.TokenStorageKey != "null" &&
            window.localStorage.TokenStorageKey.length > 0
        ) {
            history.goBack();
        }

    }, []);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        event.stopPropagation();

        if (enteredPhone.current == undefined || enteredPhone.current.length == 0) {
            toast.error('Please enter your mobile number')
            return
        }

        setisSubmitting(true)
        toast.promise(
            forgetPass({ mobile: enteredPhone.current })
            .then(() => {
                history.push({
                    pathname: '/reset-pass'
                })
            })
            .finally(() => setisSubmitting(false)),
            {
              loading: 'Loading',
              success: () => `Successfully we've send you a verify code`,
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
                                    Forget your password?
                                </h1>
                            </Form.Group>
                            <Form.Group >
                                <Form.Text className="text-muted">
                                    Just enter your mobile number and we'll send you a code to reset your password
                                </Form.Text>
                            </Form.Group>
                            <Form onSubmit = { handleSubmit }>
                                <Form.Group controlId="formUserEmail">
                                <Form.Label>Mobile Number <span className="required">*</span></Form.Label>
                                <PhoneInput
                                    onChange = { value => enteredPhone.current = value }
                                    country = { 'gb' }
                                    onlyCountries = {[ 'ie', 'ch', 'no', 'gb' ]}
                                    countryCodeEditable={false}
                                    inputClass = 'phone-input-form-control'
                                    inputProps={{
                                        name: 'phone',
                                        required: true,
                                        autoFocus: true
                                    }}
                                />
                                </Form.Group>
                                <div className="centered form-group">
                                    <Button disabled = { isSubmitting } variant="primary" type="submit">
                                        send code
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
            </Col>
        </Row>
    </Container>
}

export default ForgetPass
