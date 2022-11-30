export type UserInfo = {
    id: string,
    full_name?: string
    mobile: string
    country_code: string
    username: string
    tel: string //don't the difference between this and mobile
    vat: number
    alias: string
}

export type RegisterInputs = {
    mobile: string,
    email?: string,
    full_name: string,
    password: string
}

export type UserAddress = {
    id?: string
    name?: string
    lat?: number
    long?: number
    town?: string
    line1: string
    line2?: string
    country?: string
    postal_code: string
    is_default?: boolean
}

export type UserStore = {
    user?: UserInfo
    temporaryPhone?: string //it would be used in the registration progress
}

export type UserContext = UserStore & {
    logout: () => void
    resendSms: () => Promise<void>
    getUserAddress: () => Promise<UserAddress[]>
    addAddress: (input: UserAddress) => Promise<void>
    verifyPhone: (verify_code: string ) => Promise<void>
    register: ( inputs: RegisterInputs ) => Promise<void>
    login: (input: { mobile: string, password: string }) => Promise<void>
    forgetPass: (input: { mobile: string }) => Promise<void>
    resetPassword: (inputs: { newPass: string, verifyCode: string }) => Promise<void>
}
