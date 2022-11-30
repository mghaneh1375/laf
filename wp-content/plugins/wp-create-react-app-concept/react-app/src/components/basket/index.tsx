import React from 'react'
import { BasketItem } from 'type/market'
import { useMarketContext } from 'store/marketStore'
import {MenuFilter, MenuItem} from 'type/menu'
import { getPrice, toFixed } from 'lib/handy'

//styles
import './style.scss'
import { Button, Container } from 'react-bootstrap'
import ModalMenuItem, { MenuItemModalDataType } from 'components/menu/modalMenuItem'

import editIcon from 'images/edit.png'
import { useHistory } from 'react-router'

//assets
import UpArrow from 'images/uparrow.png'
import Menu from "react-select/src/components/Menu";

type Props = {
    filter: MenuFilter
}

const Basket = ({ filter }: Props) => {

    //hook
    const {
        basketItems,
        deliveryTime,
        deliveryCost,
        storeInfo,
        removeFromBasket
    } = useMarketContext()
    const history = useHistory()

    //state
    const [isBasketExpanded, setIsBasketExpanded] = React.useState<boolean>(false)
    const [editingBasketItem, setEditingBasketItem] = React.useState<BasketItem>()
    const [morePriceNeedToStartCheckout, setMorePriceNeedToStartCheckout] = React.useState<number>(0)
    const [itemIndex, setItemIndex] = React.useState(0);

    //refrences
    const [basketTotal, setBasketTotal] = React.useState<number>(0)

    const basketItemIsAvailable = (item: MenuItem, filter: MenuFilter, size_id?: string): boolean =>
    {
        let size = item.sizes.find(s => s.id == size_id);
        if(size && size.collect_price != null && parseFloat(size.collect_price) == 0 && filter == MenuFilter.TakeOut) return false;
        if(size && size.delivery_price != null && parseFloat(size.delivery_price) == 0 && filter == MenuFilter.Delivery) return false;
        if(size && size.table_price != null && parseFloat(size.table_price) == 0 && filter == MenuFilter.Booking) return false;

        if(item.is_active == false) return  false;
        if(item.is_collect == false && filter == MenuFilter.TakeOut) return  false;
        if(item.is_delivery == false && filter == MenuFilter.Delivery) return false;
        if(item.is_table == false && filter == MenuFilter.Booking) return false;

        return true;
    }

    React.useEffect(() => {
        basketItems.filter(e => !basketItemIsAvailable(e.item, filter, e.sizeOptionId))
            .map((e) => removeFromBasket(e))
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

    return <div className= { `basketContainer ${ isBasketExpanded ? 'expanded' : '' }`}>
        <div>
            <Container>
                <div className="form-group"/>
                <div className="form-group basket-top-header" onClick = { () => setIsBasketExpanded( p => !p ) }>
                    <h5 className="basket-title">Basket {basketItems.length ? <span className="basket-count">{basketItems.length}</span> : ''} <span className="total-title">£{ basketTotal.toFixed(2) }</span></h5>
                    <div className='basket-arrow-container'>
                        <img src = { UpArrow }/>
                    </div>
                </div>
                { filter == MenuFilter.Delivery && deliveryTime && <p className='min-delivery-time'>Minimum delivery time: { `${deliveryTime} minutes` }</p>}
                { filter == MenuFilter.TakeOut && storeInfo?.min_expected_takeout_time && <p className='min-delivery-time'>Minimum preparation time for takeout order: { `${storeInfo.min_expected_takeout_time} minutes` }</p>}
                <div className="basket-items">
                    { basketItems.length == 0 && <div className='centered'>
                        <p>Your Basket is Empty!</p>
                    </div> }
                    { basketItems.map((item, index) =>
                        <div key = { index } className='basket-item-wrapper'>
                            <label className='basket-item-name'>{ item.item.name }</label>
                            <label className='price-label'>£{ `${(item.quantity * getPrice({ item: item.item, filter, selectedSizeId: item.sizeOptionId })).toFixed(2) }` }</label>
                            <label className='basket-item-quantity'>
                                { `Quantity: ${item.quantity} ${sizeLabel(item)}` }
                            </label>
                            <Button variant="outline-info" onClick = { () => {
                                setItemIndex(index);
                                setEditingBasketItem(item);
                            } }><img style = {{ width: '15px', height: '15px' }} src = { editIcon }/></Button>
                        </div>
                    )}
                </div>
                <hr/>
                { basketItems.length > 0 && <div>
                    { deliveryCost && <div className='subtotal'><span>Subtotal:</span><span>£{ (basketTotal - deliveryCost).toFixed(2) }</span></div>}
                    { deliveryCost && <div className='subtotal'><span>Delivery Charge:</span><span>£{ deliveryCost.toFixed(2) }</span></div>}
                    { basketTotal != 0 && <React.Fragment><div className="total"><span>Total:</span><span>£{ basketTotal.toFixed(2) }</span></div><hr/></React.Fragment> }
                    { morePriceNeedToStartCheckout > 0 && <div className='delivery-min-price'>
                        Spend £{ morePriceNeedToStartCheckout.toFixed(2) } more to to start checkout
                </div>}
                </div>}
            </Container>
        </div>
        <ModalMenuItem
            filterType = { filter }
            input = { editingBasketItem ? { type: MenuItemModalDataType.Basket, item_index: itemIndex, dataSource: editingBasketItem }: undefined }
            dismiss = { () => setEditingBasketItem(undefined) }/>

            <div className="tip">
                * If you have food allergy or intolerance, please contact the restaurant before placing your order.
            </div>

        { basketItems.length > 0 && morePriceNeedToStartCheckout == 0 && <div className='form-group centered'>
            <Button onClick = { () => history.push({ pathname: '/checkout' }) } variant="primary">Start Checkout</Button>
        </div>}
    </div>
}

export default Basket
