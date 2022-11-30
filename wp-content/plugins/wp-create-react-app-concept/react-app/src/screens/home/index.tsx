import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import './style.scss'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'
import { useMarketContext } from 'store/marketStore'

const Home = () => {

    //hooks
    let location = useLocation();
    const { t } = useTranslation()
    const { storeInfo } = useMarketContext()

    return <Container>
        <Row>
            <Col>
                <div className="background">
                    <div className='overlayContentWrapper'>
                        <p className='bg-title'>{ storeInfo?.full_name }</p>
                    </div>
                </div>
                <div className='actionButtons'>
                    { storeInfo?.is_take_out_active == true && <Link to = '/order/takeout' className='orderButton'>Order Takeout Now</Link> }
                    { storeInfo?.is_delivery_active == true &&
                        <Link to = {{
                            pathname: '/postcode-check',
                            state: { background: location
                        }}} className='orderButton'>Order Delivery Now</Link>
                    }
                </div>
                {/*<div className='actionButtons'>*/}
                    {/*{ storeInfo?.is_booking_active == true && <Link to = '/booking' className='bookingButton'>Book Now</Link> }*/}
                {/*</div>*/}
            </Col>
        </Row>
    </Container>
}

export default Home
