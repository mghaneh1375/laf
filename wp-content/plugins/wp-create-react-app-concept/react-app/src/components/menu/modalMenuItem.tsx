import React from 'react'
import { Button, Modal, Row, Col } from 'react-bootstrap'
import { Id, MenuFilter, MenuItem } from 'type/menu'
import { useTranslation } from 'react-i18next'
import SelectOption, { Option } from './selectOption'
import { getPrice } from 'lib/handy'
import { BasketItem } from 'type/market'
import { useMarketContext } from 'store/marketStore'

export enum MenuItemModalDataType {
    Basket, Normal
}

export type ModalMenuItemDataSource = {
    type: MenuItemModalDataType.Normal,
    dataSource: MenuItem
} | {
    type: MenuItemModalDataType.Basket,
    item_index: number,
    dataSource: BasketItem
}

type Props = {
    input?: ModalMenuItemDataSource
    filterType: MenuFilter
    dismiss: () => void
}

const ModalMenuItem = ({ input, filterType, dismiss }: Props) => {
    //hooks
    const { t } = useTranslation()
    const { addToBasket, removeFromBasket, updateBasketItem, activeMenuFilter } = useMarketContext()

    //states
    const [sizeOptions, setSizeOptions] = React.useState<Option<{ price: number, id: Id }>[]>([])
    const [selectedQuantity, setSelectedQuantity] = React.useState<number>(1)
    const [selectedSizeIndex, setSelectedSizeIndex] = React.useState<number>()

    //refrences
    const quantityRef = React.useRef<number>(selectedQuantity)

    React.useEffect(() => {
        quantityRef.current = selectedQuantity
    }, [selectedQuantity])

    React.useEffect(() => {
        if (input == undefined) return
        let item = input.type == MenuItemModalDataType.Normal ? input.dataSource : input.dataSource.item
        let options: Option<{ price: number, id: Id }>[] = item.sizes.map((e) => {
                let currentMenufilterPrice = MenuFilter.Delivery == activeMenuFilter ?
                        parseFloat(e.delivery_price || "0") :
                        parseFloat(e.collect_price || "0")
                return (e.is_active == true && currentMenufilterPrice !== 0) ? {
                    label: e.name || '',
                    metaData: { price: currentMenufilterPrice, id: e.id }
                } : undefined
            }).filter(e => e != undefined)
            .map(e => e!) //just for force cast in type script
            .map((e, i) => {
                if ( input.type == MenuItemModalDataType.Basket &&
                    input.dataSource.sizeOptionId &&
                    input.dataSource.sizeOptionId == e.metaData.id ) {
                        setSelectedSizeIndex(i)
                }
                return { ...e, index: i }
            })

        if (options.length == 1) { setSelectedSizeIndex(0) }

        setSizeOptions(options)
        if (input.type == MenuItemModalDataType.Basket) {
            setSelectedQuantity(input.dataSource.quantity)
        }

        return () => {
            setSizeOptions([])
            setSelectedQuantity(1)
            setSelectedSizeIndex(undefined)
        }
    }, [input, filterType])

    let theItem = input?.type == MenuItemModalDataType.Normal ? input.dataSource : input?.dataSource.item

    return <Modal scrollable animation={false} show = { input !== undefined } onHide={() => dismiss()}>
        <Modal.Header closeButton>
        <Modal.Title>{ theItem?.name }</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className="item-moda-inner-container">
                { theItem && <img className = 'item-modal-img' src = { theItem.img_full_url }/>}
                <div className='item-modal-detail'>
                    <Row>
                        <Col>
                            { theItem && <div className="price centered textFont1">{ theItem?.sizes.length > 1 ? 'from ' : ''}{ `£${ getPrice({ item: theItem!, filter: filterType }) }` }</div>}
                            <div className="description textFont1">
                                <div>
                                    { theItem?.description || 'There is no description available for this product' }
                                </div>
                            </div>
                        </Col>
                    </Row>
                    { sizeOptions.length > 1 &&
                    <SelectOption<{ price: number, id: Id }>
                        title = { t('SelectSize') }
                        options = { sizeOptions }
                        disable = {false}
                        preSelectIndeX = { selectedSizeIndex }
                        onSelect = { ({ metaData, index }) => { setSelectedSizeIndex(index) } } />
                    }
                    <Row>
                        <Col>
                            <div className="quantity">
                                <div onClick = { () => setSelectedQuantity(p => Math.max(p - 1, 1)) } className='quantity-editor'>-</div>
                                <p>{selectedQuantity}</p>
                                <div onClick = { () => setSelectedQuantity(p => p + 1) } className='quantity-editor'>+</div>
                            </div>
                        </Col>
                    </Row>
                </div>
                {
                    input?.type == MenuItemModalDataType.Basket && <a className="red" onClick = { () => { removeFromBasket(input.dataSource); dismiss() }}>Remove from basket</a>
                }
            </div>
        </Modal.Body>
        <Modal.Footer className="flex-column">
        <Button
            disabled = { sizeOptions.length > 1 && selectedSizeIndex == undefined }
            variant="primary"
            className="item-modal-btn"
            onClick={() => {
                if (input?.type == MenuItemModalDataType.Normal) {
                    addToBasket({
                        item: input.dataSource,
                        quantity: selectedQuantity,
                        sizeOptionId: selectedSizeIndex != undefined ? sizeOptions[selectedSizeIndex].metaData.id : undefined
                    })
                    dismiss()
                } else if (input?.type == MenuItemModalDataType.Basket) {
                    updateBasketItem(input.item_index, {
                        item: input.dataSource.item,
                        quantity: selectedQuantity,
                        sizeOptionId: selectedSizeIndex != undefined ? sizeOptions[selectedSizeIndex].metaData.id : undefined
                    })
                    dismiss()
                }
            }}>
            <span style={{float: 'left'}}>{ input != undefined && input.type == MenuItemModalDataType.Normal ? t('AddToBasket') : t('EditBasketItem') }</span>
            <span style={{float: 'right'}}>{ `${
                selectedSizeIndex != undefined && input != undefined ? 
                `£${ (getPrice({ 
                    item: input.type == MenuItemModalDataType.Normal ? input.dataSource : input.dataSource.item, 
                    filter: filterType, 
                    selectedSizeId: sizeOptions[selectedSizeIndex].metaData.id
                }) * selectedQuantity).toFixed(2) }` :
                ''
        }`}</span>
        </Button>
        </Modal.Footer>
    </Modal>
}

export default ModalMenuItem
