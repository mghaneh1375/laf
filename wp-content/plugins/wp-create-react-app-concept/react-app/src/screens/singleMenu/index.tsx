import React from 'react'
import {Col, Row} from 'react-bootstrap'
import {useParams} from 'react-router'
//types
import {MenuFilter} from 'type/menu'
//components
import RestaurantMenu from 'components/menu/menuWithOutCategory'
//styles
import 'components/menu/styleWithOutSubCategory.scss'
import 'components/menu/style.scss'

import {useMarketContext} from 'store/marketStore'

const MenuScreen = () => {
    //hooks
    const { filter } = useParams<{filter: MenuFilter}>()
    const { activeMenuFilter, setActiveMenuFilter } = useMarketContext()

    // references
    const latestActiveFilter = React.useRef<MenuFilter | undefined>(activeMenuFilter)


    React.useEffect(() => {
        latestActiveFilter.current = filter
        setActiveMenuFilter(filter)
    }, [filter])

    return <div className="myContainer">
        <Row>
            <Col lg = '12'>
                <RestaurantMenu filter = { filter }/>
            </Col>
        </Row>

    </div>
}

export default MenuScreen
