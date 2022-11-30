import React from 'react'
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import PhoneInput from 'react-phone-input-2'
import {  useHistory, useLocation } from 'react-router-dom'
import { useMarketContext } from 'store/marketStore'
import { useUser } from 'store/userStore'
import moment from 'moment'
import { MenuFilter } from 'type/menu'
import {useParams} from "react-router";
import CurrentOrder from 'components/currentOrder';
import {formatPostCode, getErrorMessage} from 'lib/handy';

enum Fields {
    FirstName = 'firstname',
    LastName = 'lastname',
    Email = 'email',
    Mobile = 'mobile',
    Pass = 'password',
    RePass = 'repassword'
}

const StartCheckout = () => {


    //hooks
    const history = useHistory()
    const { t } = useTranslation()
    const { pathname } = useLocation()
    const { user } = useUser()
    const {
        activeMenuFilter,
        availableDeliverTime,
        activePostCode,
        basketItems,
        submitOrder
    } = useMarketContext()

    //states
    const [isFormValidated, setIsFormValidated] = React.useState<boolean>(false)
    const [isFormSubmitting, setIsFormSubmitting] = React.useState<boolean>(false)

    //references
    const enteredPhone = React.useRef<string | undefined>(user?.mobile)
    const enteredFullName = React.useRef<string | undefined>(user?.full_name)
    const enteredPostCode = React.useRef<string |  undefined>(activePostCode?.postCode)
    const enteredAddressLine1 = React.useRef<string | undefined>(activePostCode?.line1)
    const enteredAddressLine2 = React.useRef<string | undefined>(activePostCode?.line2)
    const enteredTown = React.useRef<string | undefined>(activePostCode?.town)
    const enteredDeliverTime = React.useRef<moment.Moment>()
    const enteredMoreDescription = React.useRef<string>()
    const activeMenuFilterRef = React.useRef<MenuFilter | undefined>(activeMenuFilter)
    const isActive = React.useRef<boolean>(true)

    React.useEffect(() => {
        //wait untill everything has been set
        setTimeout(() => {
            if (activeMenuFilterRef.current == undefined && isActive.current == true) {
                history.replace({ pathname: '/' })
            }
        }, 1000);

        return () => { isActive.current = false }
    }, [])

    React.useEffect(() => {
        activeMenuFilterRef.current = activeMenuFilter
    }, [activeMenuFilter])

    React.useEffect(() => {
        if (user) {
            enteredPhone.current = user.mobile
            enteredFullName.current = user.full_name
        }
    }, [user])

    React.useEffect(() => {
        if( availableDeliverTime && availableDeliverTime.length > 0 ) {
            enteredDeliverTime.current = availableDeliverTime[0]
        }
    }, [availableDeliverTime])

    React.useEffect(() => {
        if (activePostCode) {
            enteredPostCode.current = activePostCode.postCode
            enteredAddressLine1.current = activePostCode?.line1
            enteredAddressLine2.current = activePostCode.line2
            enteredTown.current = activePostCode.town
        }
    }, [activePostCode])

    const goForLoginSignUp = () => {
        history.push({
            pathname: '/login',
            state: { nextPathname: pathname }
        })
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsFormValidated(true)
        if (activeMenuFilter == undefined) return

        if (enteredPhone.current == undefined) {
            toast.error('Please enter your mobile number')
            return
        }


        setIsFormSubmitting(true)
        let orderRows = basketItems.map((item) => {
            return {
                size_id: item.sizeOptionId,
                count: item.quantity,
            }
        })

        toast.promise(
            submitOrder({
                customer_info: {
                    full_name: enteredFullName.current == undefined ? '' : enteredFullName.current,
                    mobile: enteredPhone.current,
                    address: {
                        lat: activePostCode?.lat,
                        long: activePostCode?.long,
                        line1: enteredAddressLine1.current || activePostCode?.line1,
                        line2: enteredAddressLine2.current || activePostCode?.line2,
                        town: enteredTown.current || activePostCode?.town,
                        postal_code: activePostCode?.postCode
                    }
                },
                order_type: activeMenuFilter,
                order_rows: orderRows,
                delivery_date: enteredDeliverTime.current?.format('YYYY-MM-DDTHH:mm:ss'),
                customer_id: user?.id,
                // customer_address_id: activePostCode?.id,
                description: enteredMoreDescription.current
            })
            .then(() => {
                history.replace({ pathname: '/payment' })
            }).finally(() => {
                setIsFormSubmitting(false)
            }),
            {
                loading: 'Submiting',
                success: () => `Your order has been submitted.`,
                error: (e) => getErrorMessage(e),
        })
    }

    return <Container>
        <Row>
            <Col md = {{ span: 8 }}>
                <Form.Group />
                <Card>
                    <Card.Body>
                        {
                            user == undefined && <>
                                <Form.Group >
                                    <h2 className='centered'>
                                        How do you want to continue?
                                    </h2>
                                </Form.Group>
                                <Form.Group className='centered'>
                                    <Button onClick = { goForLoginSignUp } variant="outline-primary">Login/Signup</Button>
                                </Form.Group>
                                <Form.Group className='centered'>
                                    ---------- OR ----------
                                </Form.Group>
                                <h2 className='centered'>
                                    Continue as a guest
                                </h2>
                            </>
                        }
                        {
                            user != undefined && <>
                                <h2 className='centered'>
                                    {`Hi ${user.full_name}`}
                                </h2>
                            </>
                        }
                        <Form noValidate validated = { isFormValidated } onSubmit = { handleSubmit }>
                            {
                                user == undefined && <Form.Group controlId="StartCheckoutFirtName">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control
                                        type="text" placeholder="Name"
                                        className="capitalize"
                                        onChange = { e => enteredFullName.current = e.target.value }/>
                                </Form.Group>
                            }
                            <Form.Group controlId="StartCheckoutMobile">
                                <Form.Label>Mobile Number <span className="required">*</span></Form.Label>
                                <PhoneInput
                                    country = { 'gb' }
                                    onlyCountries = {[ 'ie', 'ch', 'no', 'gb' ]}
                                    inputClass = 'phone-input-form-control'
                                    value = { user?.mobile }
                                    countryCodeEditable={false}
                                    onChange = { value => enteredPhone.current = value }
                                    inputProps={{
                                        name: 'mobile number',
                                        required: true,
                                        autoFocus: false
                                    }}
                                />
                                {  <Form.Control.Feedback type='invalid'>Please enter a valid mobile number</Form.Control.Feedback>}
                                <Form.Text className="text-muted">
                                    We use this mobile number for delivery contact.
                                </Form.Text>
                            </Form.Group>
                            {
                                activeMenuFilter == MenuFilter.Delivery && <Form.Group controlId="StartCheckoutAddress">
                                    <Form.Label>Address To Deliver</Form.Label>
                                    <Form.Control
                                        required
                                        type="text" placeholder="Postal code"
                                        className="postcode"
                                        value = { activePostCode?.postCode != undefined ? formatPostCode(activePostCode?.postCode) : '' }
                                        readOnly = { activePostCode != undefined }
                                        onChange = { e => { enteredPostCode.current = e.target.value }}/>
                                    <Form.Control
                                        required
                                        type="text" placeholder="Address line 1"
                                        value = { activePostCode?.line1 }
                                        readOnly = { activePostCode?.line1 != undefined }
                                        onChange = { e => { enteredAddressLine1.current = e.target.value }}/>
                                    {
                                        (activePostCode?.line1 == undefined || (activePostCode?.line2 != undefined && activePostCode.line2.length > 0 )) &&
                                        <Form.Control
                                            type="text" placeholder="Address line 2"
                                            value = { activePostCode?.line2 }
                                            readOnly = { activePostCode?.line2 != undefined }
                                            onChange = { e => { enteredAddressLine2.current = e.target.value }}/>
                                    }
                                    <Form.Control
                                        required
                                        type="text" placeholder="Town or city"
                                        value = { activePostCode?.town }
                                        readOnly = { activePostCode?.town != undefined }
                                        onChange = { e => { enteredTown.current = e.target.value }}/>

                                </Form.Group>
                            }
                            <Form.Group controlId="StartCheckoutDeliveryTime">
                                <Form.Label>{`When do you want ${activeMenuFilter == MenuFilter.Delivery ? 'your delivery?' : 'to collect?'}`}</Form.Label>
                                { availableDeliverTime && availableDeliverTime.length > 0 &&
                                    <Form.Control required as="select" defaultValue = '0' onChange = { e => {
                                        enteredDeliverTime.current = availableDeliverTime[parseInt(e.target.value)]
                                        }}>
                                        <option value = '0'>{`ASAP (${availableDeliverTime[0].format('dddd HH:mm')}-${moment(availableDeliverTime[0]).add(15,'m').format('HH:mm')})`}</option>
                                        { availableDeliverTime && availableDeliverTime
                                            .slice(1) //to ignore first one
                                            .map((e, i) => <option key = { i } value = { i }>{ e.format('dddd HH:mm') }-{moment(e).add(15,'m').format('HH:mm')}</option>) }
                                    </Form.Control>
                                }
                                { availableDeliverTime && availableDeliverTime.length == 0 && <div style={{color: 'darkred'}}>There is not any valid time for today.</div>}
                            </Form.Group>
                            <Form.Group controlId="StartCheckoutFirtLastName">
                                <Form.Label>{ `Message for ${ activeMenuFilter == MenuFilter.Delivery ? "delivery": "your order"}`}</Form.Label>
                                <Form.Control
                                    onChange = { e => enteredMoreDescription.current = e.target.value }
                                    as="textarea" rows={3} />
                            </Form.Group>
                            <div className="centered form-group">
                                <Button disabled = { isFormSubmitting || (availableDeliverTime && availableDeliverTime.length == 0) } variant="primary" type="submit">
                                    Submit
                                </Button>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>
            </Col>
            <Col md={{ span: 4 }}>
                <Form.Group />
                <CurrentOrder filter={activeMenuFilter!} submitted={false} />
            </Col>
        </Row>
    </Container>
}

export default StartCheckout
