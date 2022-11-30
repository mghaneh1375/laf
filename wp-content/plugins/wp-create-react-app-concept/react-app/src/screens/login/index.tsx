import React from 'react'
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import PhoneInput from 'react-phone-input-2'
import { Link, useHistory, useLocation } from 'react-router-dom'
import { useUser } from 'store/userStore'
import PasswordField from 'components/passwordField'
import {getErrorMessage} from "../../lib/handy";
import construct = Reflect.construct;
import {getActiveBookingApi} from "../../store/webServiceApi/booking";

const Login = () => {

    //hooks
    const { login } = useUser();
    const { state } = useLocation<{nextPathname: string}>();
    const history = useHistory();
    const { t } = useTranslation();

    //state
    const [isFormSubmitting, setIsFormSubmitting] = React.useState<boolean>(false)

    React.useEffect(() => {

        if(window.localStorage.TokenStorageKey !== undefined &&
            window.localStorage.TokenStorageKey != null &&
            window.localStorage.TokenStorageKey != "null" &&
            window.localStorage.TokenStorageKey.length > 0
        ) {
            history.goBack();
        }

    }, []);

    //reference
    const enteredPhone = React.useRef<string>();
    const enteredPass = React.useRef<string>();

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        event.stopPropagation();

        if (enteredPhone.current != undefined &&
            enteredPass.current != undefined) {
            setIsFormSubmitting(true);
            login({
                mobile: enteredPhone.current,
                password: enteredPass.current
            })
                .then(() => {
                    // window.location.href = window.location.href.substr(0, window.location.href.indexOf("/menu/login")) + "/menu";
                    // history.replace({ pathname: state?.nextPathname || "/" })
                    if(window.localStorage.refer !== undefined &&
                        !window.localStorage.refer.includes("forgetpass")
                    ) {
                        var refer = window.localStorage.refer;
                        window.localStorage.removeItem("refer");
                        window.location.href = refer;
                    }
                    else
                        window.location.href = "/";
                })
                .catch((e) => {
                    toast.error(getErrorMessage(e))
                }).finally(() => {
                    setIsFormSubmitting(false)
                })
        }
    };

    return <Container>
        <Row>
            <Col md = {{ span: 6, offset: 3 }}>
                <Form.Group />
                <Card>
                    <Card.Body>
                        <Form.Group >
                            <h1 className='centered'>
                                Welcome Back..
                            </h1>
                        </Form.Group>
                        <Form onSubmit = { handleSubmit }>
                            <Form.Group controlId="formUserEmail">
                                <Form.Label>Mobile Number <span className="required">*</span></Form.Label>
                                <PhoneInput
                                    country = { 'gb' }
                                    onlyCountries = {[ 'ie', 'ch', 'no', 'gb' ]}
                                    onChange = { value => enteredPhone.current = value }
                                    inputClass = 'phone-input-form-control'
                                    countryCodeEditable={false}
                                    inputProps={{
                                        name: 'phone',
                                        required: true,
                                        autoFocus: true
                                    }}
                                />
                            </Form.Group>

                            <Form.Group controlId="formUserPassword">
                                <Form.Label>Password <span className="required">*</span></Form.Label>
                                <PasswordField
                                    required =  { true }
                                    onChange = { e => enteredPass.current = e.target.value }
                                    name='password'
                                    placeholder="Password"
                                    />
                            </Form.Group>
                            <Form.Group controlId="formBasicCheckbox">
                                <Row>
                                    <Col sm = {{ span: 6, offset: 6 }} className='textAlignRight'>
                                        <Link to='/forgetpass'>Forget Password?</Link>
                                    </Col>
                                </Row>
                            </Form.Group>
                            <div className="centered form-group">
                                <Button disabled = { isFormSubmitting } variant="primary" type="submit">
                                    sign in
                                </Button>
                            </div>
                            <div className='centered'>
                                <p>Don't have an account? <Link to='/signup'>Sign Up</Link></p>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    </Container>
};

export default Login
