import React from 'react'
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import { useMarketContext } from 'store/marketStore'
import { PaymentMethodType, ResturantPaymentMethod } from 'type/branch'
import {useStripe, useElements, CardElement, Elements } from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { MenuFilter } from 'type/menu'
import CurrentOrder from "../../components/currentOrder";
import {getErrorMessage} from "../../lib/handy";

type Props ={
    shouldPay: boolean
    gotError: (e: Error) => void
    successfull: () => void
}

const StripeCardField = ({ shouldPay, gotError, successfull }: Props) => {

    //hooks
    const { getStripeSecretKey, clearBasket, saveOrderInHistory } = useMarketContext()
    const stripe = useStripe();
    const history = useHistory()
    const elements = useElements();
    const { t } = useTranslation()

    React.useEffect(() => {
        if (shouldPay == true)
            payWithStripe()
    }, [shouldPay])

    const payWithStripe = () => {
        toast.promise(
            getStripeSecretKey()
                .then((secretKey) => {
                    const cardElement = elements?.getElement(CardElement);
                    if (cardElement) {
                        return stripe?.confirmCardPayment(secretKey, {
                            payment_method: {
                                card: cardElement
                            },
                        }).then((e) => {
                            if (e.error) { throw e }
                            else {
                                saveOrderInHistory();
                                clearBasket();
                                history.replace('/');
                                successfull()
                            }
                        })
                    } else {
                        throw Error('Stripe module is not ready')
                    }
            }),
            {
              loading: 'Loading',
              success: () => `Successful payment`,
              error: (e) => {
                  return getErrorMessage(e)
              },
        })
    }

    return <CardElement />
}

const PaymentScreen = () => {

    //hooks
    const { submittedOrder, storeInfo, assignPaymentMethod, activeMenuFilter, clearBasket, saveOrderInHistory } = useMarketContext()
    const history = useHistory()
    const { t } = useTranslation()

    //states
    const [shouldPayWithStripe, setShouldPayWithStripe] = React.useState<boolean>(false)
    const [isStripeElementPresented, setIsStripeElementPresented] = React.useState<boolean>(false)
    const [isSubmitting, setisSubmitting] = React.useState<boolean>(false)

    //consts
    const selectedMethod = React.useRef<ResturantPaymentMethod>()
    const stripePromise = loadStripe(storeInfo?.stripe_publishable_key ?? '', {
        stripeAccount: storeInfo?.stripe_account_id
    })
    const menuFilterPayments: { [x in MenuFilter]: { [x in PaymentMethodType]?: true }} = {
        [MenuFilter.Delivery]: {
            [PaymentMethodType.CardOnDelivery]: true,
            [PaymentMethodType.CashOnDelivery]: true,
            [PaymentMethodType.Online]: true,
        },
        [MenuFilter.TakeOut]: {
            [PaymentMethodType.Offline]: true,
            [PaymentMethodType.Online]: true,
        },
        [MenuFilter.Booking]: {
            [PaymentMethodType.Online]: true,
        },
    }

    React.useEffect(() => {
        if (storeInfo == undefined || submittedOrder == undefined)
            history.replace('/')
    }, [])

    const changeMethod = (method: ResturantPaymentMethod) => {
        selectedMethod.current = method
        setIsStripeElementPresented(method.name == 'online')
        if (method.name != 'online') {
            setShouldPayWithStripe(false)
        }
    }

    const submitToPay = () => {
        if (selectedMethod.current == undefined) {
            toast.error('Please select one of payment methods')
            return
        }
        setisSubmitting(true)
        if (selectedMethod.current.name == 'online') {
            setShouldPayWithStripe(true)
            return
        } else {
            toast.promise(
                assignPaymentMethod(selectedMethod.current)
                    .then(() => {
                        saveOrderInHistory();
                        clearBasket();
                        history.replace('/');
                    })
                    .finally(() => setisSubmitting(false)),
                {
                  loading: 'Loading',
                  success: () => `Successful payment`,
                  error: (e) => getErrorMessage(e),
            })
        }
    }

    return <Container>
        <Row>
            <Col md = {{ span: 5, offset: 1 }}>
                <Form.Group />
                <Card>
                    <Card.Body>
                        <Form.Group >
                            <h3 className='centered'>
                                Choose Your Payment
                            </h3>
                        </Form.Group>
                        <Form.Group>
                            <Form.Text className="text-muted">
                                Please select one of these payment methods
                            </Form.Text>
                            {
                                activeMenuFilter &&
                                storeInfo?.pay_methods
                                    .filter(e => menuFilterPayments[activeMenuFilter][e.name])
                                    .map((e, index) => {
                                    return <Form.Check
                                        key = { index }
                                        type = "radio"
                                        onChange = { () => changeMethod(e) }
                                        id = {`${index}`}
                                        label = {`${ e.title }`}
                                        name = 'payment-method'
                                        disabled = { e.is_active == false }
                                    />
                                })
                            }
                        </Form.Group>
                        { isStripeElementPresented && <Form.Group>
                            <Form.Group>
                                <Form.Text className="text-muted">
                                    Please enter your card number to complete your purchase
                                </Form.Text>
                            </Form.Group>
                            <Elements stripe={stripePromise}>
                                <StripeCardField
                                    shouldPay = { shouldPayWithStripe }
                                    gotError = { () => {
                                        setShouldPayWithStripe(false);
                                        setisSubmitting(false)
                                    }}
                                    successfull = { () => {  }}/>
                            </Elements>
                        </Form.Group>}
                        <Form.Group className='centered'>
                            <Button disabled = { isSubmitting && false } onClick = { submitToPay } variant="primary">
                                Submit
                            </Button>
                        </Form.Group>
                    </Card.Body>
                </Card>
            </Col>
            <Col md={{ span: 4 }}>
                <Form.Group />
                <CurrentOrder filter={activeMenuFilter!} submitted={true} />
            </Col>
        </Row>
    </Container>
}

export default PaymentScreen
