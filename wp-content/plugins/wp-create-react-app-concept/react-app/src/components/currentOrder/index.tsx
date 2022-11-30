import React from 'react'
import { BasketItem } from 'type/market'
import { useMarketContext } from 'store/marketStore'
import { MenuFilter } from 'type/menu'
import { getPrice, formatPostCode } from 'lib/handy'

//styles
import './style.scss'
import { Button, Container } from 'react-bootstrap'

import editIcon from 'images/edit.png'
import { useHistory } from 'react-router'

//assets
import UpArrow from 'images/uparrow.png'
import moment from "moment/moment";

type Props = {
    filter: MenuFilter,
    submitted: boolean
}

const CurrentOrder = ({ filter, submitted }: Props) => {

    //hook
    const {
        basketItems,
        deliveryTime,
        deliveryCost,
        activePostCode,
        storeInfo,
        submittedOrder,
        removeFromBasket
    } = useMarketContext()
    const history = useHistory()

    //state
    const [isBasketExpanded, setIsBasketExpanded] = React.useState<boolean>(false)
    const [editingBasketItem, setEditingBasketItem] = React.useState<BasketItem>()
    const [morePriceNeedToStartCheckout, setMorePriceNeedToStartCheckout] = React.useState<number>(0)



    //refrences
    const [basketTotal, setBasketTotal] = React.useState<number>(0)

    React.useEffect(() => {
        basketItems.filter(e =>
            e.item.is_active == false ||
            (e.item.is_collect == false && (filter == MenuFilter.TakeOut || filter == MenuFilter.Booking)) ||
            (e.item.is_delivery == false && filter == MenuFilter.Delivery) ||
            (e.item.is_table == false && filter == MenuFilter.Booking)
        ).map((e) => removeFromBasket(e))
    }, [filter, basketItems])

    React.useEffect(() => {
        let totalPrice = basketItems
            .reduce((ac, e) =>
                ac + getPrice({ item: e.item, filter ,selectedSizeId: e.sizeOptionId}) * e.quantity
            , 0) + (deliveryCost || 0)

            //check for minimum price
        if (filter == MenuFilter.Delivery && storeInfo?.delivery_min_order_amount != undefined) {
            setMorePriceNeedToStartCheckout(Math.max(storeInfo.delivery_min_order_amount - totalPrice, 0))
        } else {
            setMorePriceNeedToStartCheckout(0)
        }

        setBasketTotal(totalPrice)
    }, [basketItems, filter, deliveryCost])

    const sizeLabel = (basketItem: BasketItem): string => {
        if (basketItem.sizeOptionId == undefined) return ""
        let selectedSizes = basketItem.item.sizes.filter((e) => e.id == basketItem.sizeOptionId)
        if (selectedSizes.length > 0 && selectedSizes[0].name != null)
            return ` - size: ${ selectedSizes[0].name }`
        return ''
    }

    return <div className= { `currentOrderContainer ${ isBasketExpanded ? 'expanded' : '' }`}>
        <div>
            <Container>
                <div className="form-group"/>
                <div className="form-group basket-top-header" onClick = { () => setIsBasketExpanded( p => !p ) }>
                    <h5 className='centered'>Your Order</h5>
                    <div className='basket-arrow-container'>
                        <img src = { UpArrow }/>
                    </div>
                </div>
                <div className="centered">
                { filter == MenuFilter.Delivery && deliveryTime && <p className='min-delivery-time'>Minimum delivery time: { `${deliveryTime} minutes` }</p>}
                { filter == MenuFilter.TakeOut && storeInfo?.min_expected_takeout_time && <p className='min-delivery-time'>Minimum preparation time: { `${storeInfo.min_expected_takeout_time} minutes` }</p>}
                </div>
                <div>
                    { basketItems.map((item, index) =>
                        <div key = { index } className='basket-item-wrapper'>
                            <label className='basket-item-quantity'>
                                { `Quantity: ${item.quantity} ${sizeLabel(item)}` }
                            </label>
                            <label className='basket-item-name'>{ item.item.name }</label>
                            <label className='price-label'>{ `£${(item.quantity * getPrice({ item: item.item, filter, selectedSizeId: item.sizeOptionId })).toFixed(2) }` }</label>
                        </div>
                    )}
                </div>
                <hr/>
                { filter == MenuFilter.Delivery && deliveryCost != undefined && <div className='subtotal'><span>Subtotal:</span><span>£{ (basketTotal - deliveryCost).toFixed(2) }</span></div>}
                { filter == MenuFilter.Delivery && deliveryCost != undefined && <div className='subtotal'><span>Delivery Charge:</span><span>£{ deliveryCost.toFixed(2) }</span></div>}
                {basketTotal != 0 && <div className="total"><span>Total:</span><span>£{ basketTotal.toFixed(2) }</span></div> }
                {filter == MenuFilter.Delivery && <div className="selected-address">
                    <hr/>
                    <span className="total">Delivery Address:</span>
                    <p>{ activePostCode !== undefined &&  (activePostCode?.line1 + " " + activePostCode?.line2 + " " + activePostCode?.town + " (" + formatPostCode(activePostCode?.postCode) + ")")}</p>
                </div>}
                {filter == MenuFilter.Delivery && submittedOrder != undefined && <div className="delivery-time">
                    <hr/>
                    <span className="total">Delivery Time: { moment(submittedOrder.delivery_date).format('ddd DD/MM/yy HH:mm') }</span>
                </div>}
            </Container>
        </div>
        { !submitted && <div className='form-group centered'>
            <Button onClick = { () => history.push({ pathname: '/menu/' + filter }) } variant="info">Edit order</Button>
        </div>}
    </div>
}

export default CurrentOrder
