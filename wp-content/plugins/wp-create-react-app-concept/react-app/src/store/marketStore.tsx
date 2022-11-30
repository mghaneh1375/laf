import React from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { PostCodeAddress, ResturantBranchInfo, ResturantPaymentMethod } from 'type/branch'
import {MarketContext, BasketItem, SavingPostalCode, SubmitingOrder, Order, OrderHistory} from "type/market"
import { MenuFilter } from 'type/menu'
import { getResturantBranchInfo, searchForPostCodeApi } from './webServiceApi/branch'
import { getFromStorage, removeFromStorage, saveInStorage } from 'lib/storage'
import {
    addressToString,
    getAvailableDeliverTimes,
    getErrorMessage,
    getNumFrom,
    isDev,
    removeWhiteSpace,
    REQUEST_BRANCH
} from 'lib/handy'
import moment from 'moment'
import { getStripeSecretKeyApi, subitPaymentMethodApi, submitOrderApi } from './webServiceApi/market'
import {UserAddress} from "../type/user";

const MarketContextContainer = React.createContext<MarketContext>({
    basketItems: [],
    history: [],
    searchForPostCode: async () => { throw Error('not Implemented') },
    selectPostCode: () => false,
    isRestaurantActiveNow: () => false,
    addToBasket: () => {},
    removeFromBasket: () => {},
    setActiveMenuFilter: () => {},
    updateBasketItem: () => {},
    clearBasket: () => {},
    clearOrderHistory: () => {},
    saveOrderInHistory: () => {},
    submitOrder: async () => {},
    assignPaymentMethod: async () => {},
    getStripeSecretKey: async () => { throw Error('not Implemented') },
})

const MarketProvider = ({ children }: { children: React.ReactNode }) => {

    //hooks
    const { t } = useTranslation()

    const BRANCH_ID = REQUEST_BRANCH()

    //consts
    const basketStorageKey = 'BasketStoreKey-' + BRANCH_ID;
    const historyStorageKey = 'historyStoreKey-' + BRANCH_ID;
    const activeFilterStorageKey = 'activeFilter-' + BRANCH_ID;
    const selectedPostCodeWithAddressKey = 'selectedPostCode-' + BRANCH_ID;

    //states
    const [storeInfo, setStoreInfo] = React.useState<ResturantBranchInfo>()
    const [basketItems, setBasketItems] = React.useState<BasketItem[]>([])
    const [history, setHistory] = React.useState<OrderHistory[]>([])
    const [activeMenuFilter, setActiveMenuFilter] = React.useState<MenuFilter>()
    const [deliveryTime, setDeliveryTime] = React.useState<number>()
    const [deliveryCost, setDeliveryCost] = React.useState<number>()
    const [availableDeliverTime, setAvailableDeliverTime] = React.useState<moment.Moment[]>()
    const [activePostCode, setActivePostCode] = React.useState<SavingPostalCode>()
    const [submittedOrder, setSubmittedOrder] = React.useState<Order>()

    //references
    const isInitialized = React.useRef<boolean>(false)
    const storeInfoRef = React.useRef<ResturantBranchInfo | undefined>(storeInfo)
    const activeMenuFilterRef = React.useRef<MenuFilter>()
    const abortCtrl = React.useRef<AbortController>()
    const submittedOrderRef = React.useRef<Order | undefined>(submittedOrder)

    //in order to prevnet stale refenrece effect
    React.useEffect(() => {
        storeInfoRef.current = storeInfo
    }, [storeInfo])

    React.useEffect(() => {
        submittedOrderRef.current = submittedOrder
    }, [submittedOrder])

    React.useEffect(() => {
        activeMenuFilterRef.current = activeMenuFilter
        if (activeMenuFilter != MenuFilter.Delivery) {
            setDeliveryTime(undefined)
            setDeliveryCost(undefined)
        }
    }, [activeMenuFilter])

    React.useEffect(() => {
        if (storeInfo != undefined && activeMenuFilter != undefined) {
            setAvailableDeliverTime(getAvailableDeliverTimes({
                intervals: activeMenuFilter == MenuFilter.Delivery ? storeInfo.delivery_times : storeInfo.takeout_times,
                startDelay: activeMenuFilter == MenuFilter.Delivery ? storeInfo.min_expected_delivery_time : storeInfo.min_expected_takeout_time,
                now: moment()
            }))
        }
    }, [activeMenuFilter, storeInfo])

    React.useEffect(() => {
        restoreLocalContents()
        getResturantBranchInfo()
        .then((resp) => {
            setStoreInfo(resp)
            restoreLocalContents()
            }).catch((e) => {
                toast.error(getErrorMessage(e))
            })
        setInterval(() => {
            getResturantBranchInfo(true)
                .then((resp) => {
                    setStoreInfo(resp)
                    restoreLocalContents()
                }).catch((e) => {
                toast.error(getErrorMessage(e))
            })
        }, 60000)
    }, [])

    React.useEffect(() => {
        if (isInitialized.current) {
            activeMenuFilter && saveInStorage(activeFilterStorageKey, activeMenuFilter)
        }
    }, [activeMenuFilter])

    React.useEffect(() => {
        isInitialized.current &&
        saveInStorage(basketStorageKey, JSON.stringify({basket: basketItems, lastUpdate: moment().format('YYYY-MM-DD HH:mm:ss')}))
    }, [basketItems])

    React.useEffect(() => {
        isInitialized.current &&
        saveInStorage(historyStorageKey, JSON.stringify(history))
    }, [history])

    const restoreLocalContents = () => {
        //retrive the previous actions
        getFromStorage(activeFilterStorageKey)
            .then((resp) => {
                let prevFilter = resp as MenuFilter
                if (prevFilter != null) setActiveMenuFilter(prevFilter)
                return getFromStorage(basketStorageKey)
                    .then((basketContent) => {
                        if (basketContent != undefined && basketContent != null) {
                            try {
                                let content = JSON.parse(basketContent)
                                let basket: BasketItem[] = content.basket;
                                let lastUpdate = moment(content.lastUpdate);
                                if(lastUpdate.isBefore(moment().subtract(5, 'hours'))){
                                    basket = [];
                                }
                                setBasketItems(basket);
                            } catch (e) {
                                isDev() && console.warn(e)
                                removeFromStorage(basketStorageKey)
                            }
                        }
                    }).then(() => {
                        if (prevFilter == MenuFilter.Delivery) {
                            return getFromStorage(selectedPostCodeWithAddressKey)
                                .then((res) => {
                                    let parsedContent: SavingPostalCode = JSON.parse(res)
                                    selectPostCode({ ... parsedContent })
                                }).catch()
                        }
                        return
                    }).then(() => {
                        return getFromStorage(historyStorageKey)
                            .then((res) => {
                                let parsedContent: OrderHistory[] = JSON.parse(res)
                                // remove orders older than 1 days
                                const expire_date = moment().subtract('24', 'hours');
                                parsedContent = parsedContent.filter(o => moment(o.created_at, 'DD/MM/YYYY HH:mm:ss').isAfter(expire_date));
                                setHistory(parsedContent)
                            }).catch()
                    })
            })
            .catch() //
            .finally(() => {
                isInitialized.current = true
            })
    }

    const addToBasket = (item: BasketItem) => {
        if (storeInfoRef.current == undefined) {
            let message = t('NotProperResponse')
            toast.error(message)
            return
        }

        setBasketItems(p => {
            let prevSameItems = p.filter(e => e.item.id == item.item.id && e.sizeOptionId == item.sizeOptionId )
            return prevSameItems.length > 0 ?
                        p.map(e => e.item.id == item.item.id && e.sizeOptionId == item.sizeOptionId ? { ...e, quantity:  e.quantity + item.quantity } : e) :
                        [ ...p, item ]
        })
    }

    const saveOrderInHistory = () => {
        const order:OrderHistory = {
            id: submittedOrder?.id,
            payment: submittedOrder?.preferred_pay_method,
            created_at: moment().format('DD/MM/yy HH:mm:ss'),
            delivery_charge: deliveryCost,
            delivery_date: submittedOrder?.delivery_date,
            order_type: activeMenuFilter,
            rows: basketItems,
            description: submittedOrder?.description,
            total: submittedOrder?.payable_amount,
            address: submittedOrder?.customer_info.address ? addressToString(submittedOrder?.customer_info.address as UserAddress) : '',
        };
        setHistory([order, ...history])
    }

    const removeFromBasket = (item: BasketItem) => {
        setBasketItems(p => p.filter(e => e.item.id != item.item.id || item.sizeOptionId != e.sizeOptionId ))
    }

    const updateBasketItem = (index: number, item: BasketItem) => {
        let prevSameItems = basketItems.findIndex((e, i) => e.item.id == item.item.id && e.sizeOptionId == item.sizeOptionId && i != index );
        if(prevSameItems >= 0) {
            setBasketItems(p => {
                const items = p.map((e, i) => {
                    if(i == prevSameItems){
                        e.quantity += item.quantity;
                    }
                    return e;
                });
                items.splice(index, 1);
                return items;
            });
            return;
        }
        setBasketItems(p => p.map((e, i) => {
            return i == index ? item : e;
        }))
    }

    const clearBasket = () => {
        setBasketItems([])
    }

    const clearOrderHistory = () => {
        setHistory([]);
        removeFromStorage(historyStorageKey);
    }

    const searchForPostCode = (postCode: string): Promise<PostCodeAddress[]> => {
        abortCtrl.current && abortCtrl.current.abort()
        abortCtrl.current = new AbortController()
        return searchForPostCodeApi({postCode, signal: abortCtrl.current?.signal })
            .then((r) => {
                abortCtrl.current = undefined
                return r
            })
    }

    const selectPostCode = ({ postCode, ...rest }: SavingPostalCode): boolean => {
        let upperCasedPostCode = removeWhiteSpace(postCode.toUpperCase())
        let supportedPostCodes = storeInfoRef.current?.post_codes.filter((e) => upperCasedPostCode.includes(e.post_code) )
        if (supportedPostCodes && supportedPostCodes?.length > 0) {
            saveInStorage(selectedPostCodeWithAddressKey, JSON.stringify({ postCode, ...rest }))
            setActivePostCode({ postCode, ...rest })
            setDeliveryCost(getNumFrom(supportedPostCodes[0].delivery_charge))
            if (storeInfoRef.current?.min_expected_delivery_time) {
                setDeliveryTime(storeInfoRef.current?.min_expected_delivery_time)
            }
            return true
        }
        return false
    }

    const submitOrder = (input: SubmitingOrder): Promise<void> => {
        return submitOrderApi(input).then(setSubmittedOrder)
    }

    const assignPaymentMethod = (method: ResturantPaymentMethod): Promise<void> => {
        if (submittedOrderRef.current == undefined) return Promise.reject('There is no order!!')
        if(submittedOrder) submittedOrder.preferred_pay_method = method.title;
        return subitPaymentMethodApi({
            order_id: submittedOrderRef.current.id,
            pay_method_id: method.id
        }).then(() => {
            setSubmittedOrder(undefined)
        })
    }

    const getStripeSecretKey = (): Promise<string> => {
        if (submittedOrderRef.current == undefined) return Promise.reject('There is no order!!')
        return getStripeSecretKeyApi({ order_id: submittedOrderRef.current.id })
            .then((res) => res.client_secret)
    }

    const isRestaurantActiveNow = () => {
        if (storeInfo == undefined) { return false }
        if (activeMenuFilterRef.current == MenuFilter.Delivery) {
            // storeInfo.is_delivery_active && storeInfo.delivery_times
            return true
        } else {
            return true
        }
    }


    const value: MarketContext = {
        storeInfo,
        basketItems,
        history,
        deliveryTime,
        deliveryCost,
        activePostCode,
        activeMenuFilter,
        availableDeliverTime,
        submittedOrder: submittedOrder,
        clearBasket,
        saveOrderInHistory,
        clearOrderHistory,
        submitOrder,
        addToBasket,
        selectPostCode,
        removeFromBasket,
        updateBasketItem,
        searchForPostCode,
        assignPaymentMethod: assignPaymentMethod,
        getStripeSecretKey: getStripeSecretKey,
        setActiveMenuFilter,
        isRestaurantActiveNow: isRestaurantActiveNow,
    }
    return <MarketContextContainer.Provider value = { value } >{children}</MarketContextContainer.Provider>
}

export const useMarketContext = () => React.useContext(MarketContextContainer)

export default MarketProvider
