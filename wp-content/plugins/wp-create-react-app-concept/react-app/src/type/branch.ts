
export type TimeInterval = {
    week_day: string
    start_time: string
    finish_time: string
    is_active: boolean
}

export type PostalCode = {
    id: string
    post_code: string
    delivery_charge: string
}

export enum PaymentMethodType {
    Online = 'online',
    Offline = 'offline',
    CashOnDelivery = 'cash_on_delivery',
    CardOnDelivery = 'card_on_delivery'
}

export type ResturantPaymentMethod = {
    id: string
    name: PaymentMethodType
    is_active: boolean
    title?: string
}

export type ResturantTable = {
    id: string
    table_number: number
    alias: string
    occupied_by?: string
    // status: 0,
}

export type ResturantBranchInfo = {
    id: string
    vat: string
    name: string
    tel?: string
    address?: string
    full_name: string
    partner_id: string
    branch_code: number
    description?: string
    tables_count?: number
    partner_name: string
    is_closed_now: boolean
    accessibility_times: TimeInterval[]
    delivery_times: TimeInterval[]
    takeout_times: TimeInterval[]
    post_codes: PostalCode[]
    pay_methods: ResturantPaymentMethod[]
    is_eat_in_active: boolean
    is_take_out_active: boolean
    is_delivery_active: boolean
    is_table_management_active: boolean
    is_booking_active: boolean
    is_pre_order_active: boolean
    is_citymenu_active: boolean
    is_citymenu_checkout_active: boolean
    reservation_default_minutes?: number
    maximum_acceptance_capacity?: number
    min_expected_delivery_time: number
    delivery_min_order_amount: number
    min_expected_takeout_time: number
    is_branch_closed_now: boolean
    is_delivery_closed_now: boolean
    is_takeout_closed_now: boolean
    stripe_publishable_key: string
    stripe_account_id: string
}

export type PostCodeAddress = {
    full_addresses: string
    line1: string
    line2?: string
    town: string
    postcode: string
    lat: number
    long: number
}
