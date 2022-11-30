import { http } from "lib/http"
import { BASE_API_URI } from "lib/handy"
import { RegisterInputs, UserAddress } from "type/user"
import { UserInfo } from "type/user"

export async function register( inputs: RegisterInputs ): Promise<{ request_id: string }> {
    return http<{ request_id: string }>(`${BASE_API_URI()}/api/v2/cm/users/register`,
        { 
            method: 'POST',
            body: JSON.stringify(inputs)
        }
    )
}

export async function resendSms(request_id: string): Promise<void> {
    return http(`${BASE_API_URI()}/api/v2/cm/users/resend-verify-code`, 
    {
        method: 'POST',
        body: JSON.stringify({ request_id })
    })
}

export async function verifyPhone({ request_id, verify_code }: { request_id: string, verify_code: string }): Promise<{ user: UserInfo, token: string }> {
    return http<{ user: UserInfo, token: string }>(`${BASE_API_URI()}/api/v2/cm/users/verify`, 
    {
        method: 'POST',
        body: JSON.stringify({ request_id, verify_code })
    })
}

export async function login({ mobile, password }: { mobile: string, password: string }): Promise<{ user: UserInfo, token: string}> {
    return http<{ user: UserInfo, token: string }>(`${BASE_API_URI()}/api/v2/cm/users/login`, {
        method: 'POST',
        body: JSON.stringify({ mobile, password })
    })
}

export async function getAddressesApi(): Promise<UserAddress[]> {
    return http<UserAddress[]>(`${BASE_API_URI()}/api/v2/cm/addresses`)
}

export async function addAddressesApi(address: UserAddress): Promise<void> {
    return http(`${BASE_API_URI()}/api/v2/cm/addresses`, {
        method: 'POST',
        body: JSON.stringify(address)
    })
}

export async function forgetPassApi(mobile: string): Promise<{ request_id: string }> {
    return http<{ request_id: string }>(`${BASE_API_URI()}/api/v2/cm/users/forget-pass`, {
        method: 'POST',
        body: JSON.stringify({ mobile })
    })
}

export async function resetPasswordApi({ request_id, verify_code, password }: { request_id: string, verify_code: string, password: string }): Promise<void> {
    return http(`${BASE_API_URI()}/api/v2/cm/users/change-pass`, {
        method: 'POST',
        body: JSON.stringify({ request_id, verify_code, password })
    })
}