import { BASE_API_URI, cleanObj, REQUEST_BRANCH } from "lib/handy";
import { http } from "lib/http";
import { Order, SubmitingOrder } from "type/market";
import { MenuFilter } from "type/menu";



export async function submitOrderApi( inputs: SubmitingOrder ): Promise<Order> {
    return http<Order>(`${BASE_API_URI()}/api/v2/cm/orders`,
        { 
            method: 'POST',
            body: JSON.stringify(cleanObj({
                ...inputs,
                branch_id: REQUEST_BRANCH(),
                order_type: inputs.order_type == MenuFilter.Delivery ? 2 : 1,
                source: 'web'
            }))
        }
    )
}

export async function subitPaymentMethodApi({ order_id, pay_method_id }: {order_id: string, pay_method_id: string}): Promise<void> {
    return http(`${BASE_API_URI()}/api/v2/cm/payment/order-pay-method`, {
        method: 'POST',
        body: JSON.stringify({ order_id, pay_method_id })
    })
}

export async function getStripeSecretKeyApi({ order_id }: { order_id: string }): Promise<{ amount: number, client_secret: string }> {
    return http(`${BASE_API_URI()}/api/v2/cm/payment/intent`, {
        method: 'POST',
        body: JSON.stringify({ order_id })
    })
}