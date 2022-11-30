import React from 'react'
import { Col, Container, Modal, Button, Row } from 'react-bootstrap'
import { useHistory, useLocation, useParams } from 'react-router'
import moment from 'moment'

//types
import { MenuFilter } from 'type/menu'

//components
import RestaurantMenu from 'components/menu/menu'
import ToggleMenuFilter from 'components/toggleMenuFilter'
import Basket from 'components/basket'

//style
import './style.scss'
import { useMarketContext } from 'store/marketStore'

const MenuScreen = () => {
    //hooks
    const { filter } = useParams<{filter: MenuFilter}>()
    const history = useHistory()
    const thisLocation = useLocation()
    const { activeMenuFilter, availableDeliverTime, storeInfo, setActiveMenuFilter } = useMarketContext()

    //states
    const [presentOutOfOrder, setPresentOutOfOrder] = React.useState<boolean>(false)
    const [continueOutOfOrder, setContinueOutOfOrder] = React.useState<boolean>(false)

    // references
    const latestActiveFilter = React.useRef<MenuFilter | undefined>(activeMenuFilter)

    const changeFilter = (filter: MenuFilter) => {
        const location = {
            pathname: filter == MenuFilter.Delivery ? `/menu/${latestActiveFilter.current}/postcode-check` : `/menu/${filter}`,
            state: { background: thisLocation }
        }
        history.push(location)
    }

    React.useEffect(() => {
        latestActiveFilter.current = filter
        setActiveMenuFilter(filter)
    }, [filter])

    React.useEffect(() => {
        if (storeInfo != undefined &&
            ((activeMenuFilter == MenuFilter.Delivery && storeInfo.is_delivery_closed_now) ||
            (activeMenuFilter == MenuFilter.TakeOut && storeInfo.is_takeout_closed_now))
        ) {
            if(!continueOutOfOrder) setPresentOutOfOrder(true)
        }
    }, [storeInfo])

    return <Container>
        <Row>
            <Col lg = '9'>
                {/*<ToggleMenuFilter is_delivery_active = { storeInfo?.is_delivery_active } is_take_out_active = { storeInfo?.is_take_out_active } filter = { filter } attemptChangeFilter = { changeFilter }/>*/}
                <RestaurantMenu filter = { filter }/>
            </Col>
            <Col lg = '3'>
                <Basket filter = { filter }/>
            </Col>
        </Row>

        {/* simple modal presenting the error for availability */}
        <Modal animation={false} show = { presentOutOfOrder } onHide={() => setPresentOutOfOrder(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Not Available</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Closed now! We’ll open { availableDeliverTime && availableDeliverTime.length > 0 ? moment.duration(availableDeliverTime[0].diff(moment())).humanize() : '' } later. Would you like to order for later?
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => history.push({ pathname: '/' }) }>
                    Cancel
                </Button>
                <Button variant="primary" onClick={() => {
                    setPresentOutOfOrder(false)
                    setContinueOutOfOrder(true)
                }}>
                    Continue
                </Button>
            </Modal.Footer>
        </Modal>
    </Container>
}

export default MenuScreen
