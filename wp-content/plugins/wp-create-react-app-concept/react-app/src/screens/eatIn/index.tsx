import React from 'react'
import {Col, Container, Row} from 'react-bootstrap'
//types
import {MenuFilter} from 'type/menu'
//components
import RestaurantMenu from 'components/menu/readOnlyMenu'
//style
import './style.scss'

const EatInScreen = () => {

    return <Container>
        <Row>
            <Col lg = '12'>
                <RestaurantMenu filter={MenuFilter.Booking}/>
            </Col>
        </Row>
    </Container>
};

export default EatInScreen
