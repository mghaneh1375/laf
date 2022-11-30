import React from 'react'
import {Card, Col, Container, Row} from 'react-bootstrap'
import {useMarketContext} from "../../store/marketStore";
import './style.scss'
import {BasketItem} from "../../type/market";
import {MenuFilter} from "../../type/menu";
import {firstLetterUpperCase, getPrice} from "../../lib/handy";
import moment from "moment/moment";

const HistoryScreen = () => {

    //hooks
    const {history} = useMarketContext()

    const sizeLabel = (basketItem: BasketItem): string => {
        if (basketItem.sizeOptionId == undefined) return ""
        let selectedSizes = basketItem.item.sizes.filter((e) => e.id == basketItem.sizeOptionId)
        if (selectedSizes.length > 0 && selectedSizes[0].name != null)
            return `(${ selectedSizes[0].name })`
        return ''
    }

    const getMenuFilter = (filter?: string): MenuFilter => {
        return filter == MenuFilter.Delivery ? MenuFilter.Delivery : MenuFilter.TakeOut;
    }

    return <Container>
        <Row style={{marginTop: 10}}>
            <Col md = {{ span: 12 }} style={{"marginTop": "30px"}}>
                { history.length == 0 && <div className="centered">You haven't placed any orders yet.</div>}
                        {history.map((h, i) =>
                            <Card key={i} className="m-2">
                                <Card.Body>
                                    <div className="order-items">
                                        { h.rows.map((item, index) =>
                                            <div key = { index } className='order-item'>
                                                <span className="quantity">{item.quantity}</span> x <span className="item">{ item.item.name }</span> <span className="size">{ sizeLabel(item) }</span>
                                                <span className="row-total">£{ `${(item.quantity * getPrice({ item: item.item, filter: getMenuFilter(h.order_type), selectedSizeId: item.sizeOptionId })).toFixed(2) }` }</span>
                                            </div>
                                        )}
                                    </div>
                                    <div><label>Date:</label> {h.created_at}</div>
                                    <div><label>Type:</label> {firstLetterUpperCase(h.order_type != undefined ? h.order_type : '---')}</div>
                                    <div><label>Total:</label> £{h.total != undefined ? parseFloat(h.total).toFixed(2) : '--'}</div>
                                    { h.description ? <div><label>Message:</label> {h.description}</div> : '' }
                                    { (h.order_type == 'delivery' || h.order_type == 'takeout') && <div><label>{firstLetterUpperCase(h.order_type)} date and time:</label> {moment(h.delivery_date).format('DD/MM/YYYY HH:mm')}</div> }
                                { h.order_type == 'delivery' && <div>
                                    <div><label>Delivery charge:</label> £{h.delivery_charge?.toFixed(2)}</div>
                                    <div><label>Address:</label> {h.address}</div>
                                </div> }
                                </Card.Body>
                            </Card>
                        )}
            </Col>
        </Row>
    </Container>
}

export default HistoryScreen
