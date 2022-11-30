import React from 'react'
import {isDev, removeWhiteSpace, formatPostCode, addressToString} from 'lib/handy'
import { Breadcrumb, Button, Form, Modal, Spinner } from 'react-bootstrap'
import { useHistory } from 'react-router'
import { useMarketContext } from 'store/marketStore'
import { useUser } from 'store/userStore'
import { PostCodeAddress } from 'type/branch'
import { MenuFilter } from 'type/menu'
import { UserAddress } from 'type/user'

import './styles.scss'


enum FormFields {
    PostCode = 'postcode',
    Address = 'address'
}

const PostCodeCheckModal = () => {
    //hooks
    const history = useHistory()
    const { selectPostCode, searchForPostCode, storeInfo } = useMarketContext()
    const { getUserAddress, user } = useUser()

    //states
    const [formErrors, setFormErrors] = React.useState<{[x in FormFields]?: string }>()
    const [isFormValid, setIsFormValid] = React.useState<boolean>()
    const [presentingAddresses, setPresentingAddresses] = React.useState<PostCodeAddress[]>([])
    const [deliveryCosts, setDeliveryCosts] = React.useState<{ money: string, time: number}>()
    const [isLoadingAddresses, setIsLoadingAddresses] = React.useState<boolean>(false)
    const [presentingUserAddress, setPresentingUserAddress] = React.useState<(UserAddress & { isSupportedWithResturant: boolean, deliveryCost: string })[]>([])

    //references
    const enteredPostCode = React.useRef<string>()
    const selectedAddress = React.useRef<PostCodeAddress>()
    const needsToSelectAddress = React.useRef<boolean>(false)

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        event.stopPropagation()
        setFormErrors(undefined)

        if (enteredPostCode.current && ((needsToSelectAddress.current && selectedAddress.current != undefined) || needsToSelectAddress.current == false)) {
            if (selectPostCode({
                postCode: removeWhiteSpace(enteredPostCode.current.toUpperCase()),
                line1: selectedAddress.current?.line1,
                line2: selectedAddress.current?.line2,
                town: selectedAddress.current?.town,
                lat: selectedAddress.current?.lat,
                long: selectedAddress.current?.long
            })) {
                setIsFormValid(true)
                history.push({
                    pathname: `/menu/${MenuFilter.Delivery}`,
                })
            } else {
                setIsFormValid(false)
                setFormErrors({ [FormFields.PostCode]: 'Unfortunately we don\'t support this postcode area' })
            }
        } else if (needsToSelectAddress.current) {
            setIsFormValid(true)
            setFormErrors({ [FormFields.Address]: 'Please select one of these addresses' })
        } else {
            setFormErrors({
                [FormFields.PostCode]: enteredPostCode.current?.length == 0 ? 'Please enter a valid post code' : undefined,
                [FormFields.Address]: 'Please select one of these addresses'
            })
            setIsFormValid(false)
        }
    };

    const selectFromAddress = (address: UserAddress) => {
        if (
            selectPostCode({
                postCode: removeWhiteSpace(address.postal_code.toUpperCase()),
                id: address.id,
                name: address.name,
                line1: address.line1,
                line2: address.line2,
                country: address.country,
                lat: address.lat,
                long: address.long,
                town: address.town
            }) ) {
            setIsFormValid(true)
            history.push({
                pathname: `/menu/${MenuFilter.Delivery}`,
            })
        } else {
            setIsFormValid(false)
            setFormErrors({ [FormFields.PostCode]: 'Unfortunately we don\'t support this postcode area' })
        }
    }

    const postFieldValueChanged = (newValue: string) => {
        enteredPostCode.current = newValue
        setPresentingAddresses([])
        setDeliveryCosts(undefined)
        setIsLoadingAddresses(true)
        needsToSelectAddress.current = true
        selectedAddress.current = undefined

        //check for available post code (supports)
        let availablePostCodes = storeInfo?.post_codes.filter((e) => removeWhiteSpace(newValue.toUpperCase()).includes(e.post_code) )
        if (availablePostCodes && availablePostCodes.length > 0) {
            storeInfo && setDeliveryCosts({
                time: storeInfo.min_expected_delivery_time,
                money: availablePostCodes[0].delivery_charge
            })
        }

        searchForPostCode(newValue)
            .then((result) => {
                needsToSelectAddress.current = result.length > 0
                setIsLoadingAddresses(false)
                setPresentingAddresses(result)
                setFormErrors(undefined)
            }).catch((e) => {
                isDev() && console.info('error', e)
                //means that we're searching a bad postal code!!!
                if (!e || e.name != 'AbortError') {
                    setIsLoadingAddresses(false)
                }
                if (e && e.status && e.status == 400) {
                    // it seems that we don't have the address for this post code!
                    // setIsFormValid(false)
                    // setFormErrors({ [FormFields.PostCode]: 'Please enter a valid postCode!' })
                    needsToSelectAddress.current = false
                }
                // I believe it's better to do nothnig here
            })
    }

    React.useEffect(() => {
        storeInfo &&
            user
            &&
        getUserAddress()
            .then((items) => items.map((item) => {
                let activePostalCodes = storeInfo.post_codes.filter((e) =>
                    e.post_code.includes(removeWhiteSpace(item.postal_code.toUpperCase()))
                )
                return {
                    ...item,
                    isSupportedWithResturant: activePostalCodes.length > 0,
                    deliveryCost: activePostalCodes.length > 0 ? activePostalCodes[0].delivery_charge : "0$"
                }
            })).then(setPresentingUserAddress)
            .catch((e) => {
                //do nothing!
            })

    }, [])

    return <Modal scrollable animation = { false } show = { true } onHide={() => history.goBack() }>
        <Modal.Header closeButton>
            <Modal.Title>Enter You Post Code</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form className='post-code-check' validated = { isFormValid } onSubmit = { handleSubmit }>
                { presentingUserAddress.length > 0 && <Form.Group>
                    <Form.Label>ِYour previous addresses</Form.Label>
                    <Breadcrumb>
                        {
                            presentingUserAddress.map((address, index) => {
                                return <Form.Check
                                    key = { index }
                                    type = "radio"
                                    className = { address.isSupportedWithResturant == false ? 'dimmed' : '' }
                                    style = {{ whiteSpace: "pre-wrap" }}
                                    onChange = { () => selectFromAddress(address) }
                                    id = {`${index}`}
                                    label = {`${addressToString(address)} \n Delivery cost: ${ address.deliveryCost }$ ${address.isSupportedWithResturant == false ? '\nNot supported' : ''}`}
                                    disabled = { address.isSupportedWithResturant == false }
                                />
                            })
                        }
                    </Breadcrumb>
                </Form.Group>}
                { presentingUserAddress.length > 0 && <p className='centered'>---------- OR -----------</p> }
                <Form.Group controlId="formUserEmail">
                    <Form.Label>Post Code</Form.Label>
                    <Form.Group controlId="PostCode">
                        <Form.Label>Please enter your postcode (for delivery) <span className="required">*</span></Form.Label>
                        <Form.Control
                            className="postcode"
                            isInvalid = { formErrors ? formErrors[FormFields.PostCode] != undefined : false }
                            onChange = { e => postFieldValueChanged(e.target.value) }
                            type="text" placeholder="Your Postcode"/>
                        <Form.Text className="text-muted">
                            We use the postcode to check the delivery support
                        </Form.Text>
                        <Form.Control.Feedback type="invalid">
                            { formErrors != undefined && formErrors[FormFields.PostCode] }
                        </Form.Control.Feedback>
                    </Form.Group>
                    { presentingAddresses.length != 0 && <Form.Group controlId="PostCode">
                        <Form.Label>Please select one of the addresses below</Form.Label>
                        <Form.Control required as="select" defaultValue = '-1' onChange = { e => {
                                if (e.target.value != '-1') {
                                    selectedAddress.current = presentingAddresses[parseInt(e.target.value)]
                                }
                            }}>
                            <option value = '-1'>Choose...</option>
                            { presentingAddresses.map((e, i) => <option key = { i } value = { i }>{ e.full_addresses }</option>) }
                        </Form.Control>
                        { formErrors != undefined && formErrors[FormFields.Address] != undefined && <div style = {{ display: 'block' }} className='invalid-feedback'>
                            { formErrors[FormFields.Address] }
                        </div> }
                    </Form.Group>}
                    { isLoadingAddresses && <Spinner animation="border" role="status">
                        <span className="sr-only">Loading...</span>
                    </Spinner>}
                    {
                        deliveryCosts && <Form.Group className='centered'>
                            <p className='form-check-label danger'>
                                Delivery cost: {deliveryCosts.money}$
                            </p>
                            <p className='form-check-label danger'>
                                Minimum delivery time: { deliveryCosts.time } min
                            </p>
                        </Form.Group>
                    }
                    <div className="centered form-group">
                        <Button variant="primary" type="submit">
                            Continue
                        </Button>
                    </div>
                </Form.Group>
            </Form>
        </Modal.Body>
    </Modal>
}

export default PostCodeCheckModal
