import moment from "moment";
import { PostCodeAddress, ResturantBranchInfo, ResturantPaymentMethod } from "./branch";
import { Id, MenuFilter, MenuItem } from "./menu";

export type BasketItem = {
    item: MenuItem
    sizeOptionId?: Id
    quantity: number
}

export type OrderHistory = {
    id?:string,
    payment?:string,
    rows: BasketItem[]
    delivery_date?: Date
    total?: string
    delivery_charge?: number
    order_type?: string
    created_at?: string
    address?: string
    description?: string
}

//Store
export type MarketStore = {
    activePostCode?: SavingPostalCode
    storeInfo?: ResturantBranchInfo
    activeMenuFilter?: MenuFilter
    deliveryTime?: number
    deliveryCost?: number
    basketItems: BasketItem[]
    history: OrderHistory[]
    availableDeliverTime?: moment.Moment[]
    submittedOrder?: Order
}

export type SavingPostalCode = {
    id?: string
    name?: string
    line1?: string
    line2?: string
    lat?: number
    long?: number
    town?: string
    postCode: string
    country?: string
}

export type SubmitingOrder = {
    order_type: MenuFilter
    line1?: string
    line2?: string
    town?: string
    postal_code?: string
    lat?: number
    long?: number
    customer_info: {
        full_name: string
        mobile: string
        address: {
            line1?: string
            line2?: string
            lat?: number
            long?: number
            town?: string
            postal_code?: string
        }
    }
    order_rows: {
        size_id?: string
        count: number
        comment?:string
        ingredients? :  {
            ingredient_id: string
            count?: number
        }
    }[]
    reserve_id?: string
    delivery_date?: string //format should be YYYY-MM-DDTHH:mm:ss+0000"
    customer_id?: string
    customer_address_id?: string
    description?: string
}

export type Order = {
    id: string
    daily_count: string
    order_rows_sum: string
    payable_amount: string
    paid_amount: string
    refunded_amount: string
    discount?: string
    discount_type?: string
    discount_reason?: string
    description?: string
    order_type: number
    table_number: string
    customer_id: string
    vat_percent: string
    source: string,
    delivery_date: Date
    delivery_charge: string
    is_pre_order: boolean
    updated_at: Date
    created_at: Date
    customer_address_id: string
    preferred_pay_method?: string
    customer_info: {
        mobile: string
        address?: {
            lat: number
            long: number
            town: string
            line1: string
            line2: string
            postal_code: string
        },
        full_name?: string
    }
}

export type MarketContext = MarketStore & {
    selectPostCode: (input: SavingPostalCode) => boolean //return true if the post code is supported
    isRestaurantActiveNow: (filter: MenuFilter) => boolean
    searchForPostCode: (postCode: string) => Promise<PostCodeAddress[]>

    clearBasket: () => void
    saveOrderInHistory: () => void
    clearOrderHistory: () => void
    addToBasket: (item: BasketItem) => void
    removeFromBasket: (item: BasketItem) => void
    updateBasketItem: (index: number, item: BasketItem) => void
    setActiveMenuFilter: (filter: MenuFilter) => void
    submitOrder: (input: SubmitingOrder) => Promise<void>

    assignPaymentMethod: (method: ResturantPaymentMethod) => Promise<void>
    getStripeSecretKey: () => Promise<string>
}
