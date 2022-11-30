import { tokenStorageKey } from 'lib/http'
import { getFromStorage, removeFromStorage, saveInStorage } from 'lib/storage'
import React from 'react'
import { RegisterInputs, UserAddress, UserContext, UserInfo } from 'type/user'
import {
    login as loginApi,
    register as registerApi,
    verifyPhone as verifyPhoneApi,
    resendSms as resendSmsApi,
    getAddressesApi,
    addAddressesApi,
    forgetPassApi,
    resetPasswordApi
} from './webServiceApi/user'
import {useMarketContext} from "./marketStore";


const UserContextContainer = React.createContext<UserContext>({
    addAddress: async () => {},
    getUserAddress: async () => { return [] },
    resendSms: async () => {},
    verifyPhone: async () => {},
    register: async () => {},
    login: async () => {},
    logout: () => {},
    forgetPass: async () => {},
    resetPassword: async () => {}
})

const UserProvider = ({ children }: { children: React.ReactNode }) => {

    //consts
    const userStorageKey = 'UserStorageKey'

    const {clearOrderHistory} = useMarketContext();

    //states
    const [user, setUser] = React.useState<UserInfo>()
    const [temporaryPhone, setTemproryPhone] = React.useState<string>()

    //references
    const temporaryPhoneRef = React.useRef<string>()
    const registerRequestId = React.useRef<string>()
    const userAddresses = React.useRef<UserAddress[]>([])

    React.useEffect(() => {
        getFromStorage(userStorageKey)
            .then((retrievedUser) => {
                try {
                    let user = JSON.parse(retrievedUser);
                    setUser(user);
                    if (!!user) {
                        //retrieve all user's addresses
                        getUserAddress().catch((x) => {

                            if(x.toLocaleString() == "Error: token mismatch") {
                                removeFromStorage(userStorageKey);
                                removeFromStorage(tokenStorageKey);
                                logout();
                            }
                        });
                    }
                } catch {
                    removeFromStorage(userStorageKey);
                    removeFromStorage(tokenStorageKey);
                }
            }).catch(() => {
                //no need to do anything
            })
    }, []);

    const getUserAddress = (): Promise<UserAddress[]> => {
        if (userAddresses.current.length > 0)
            return Promise.resolve(userAddresses.current);
        return getAddressesApi()
            .then((r) => userAddresses.current = r)
            .catch(function (x) {
                if(x["status_code"] == 401)
                    throw new Error('token mismatch');

                throw new Error('other reason');
            })
    };

    const addAddress = (address: UserAddress): Promise<void> => {
        return addAddressesApi(address)
            .then(() => {
                userAddresses.current = [...userAddresses.current, address]
                return
            })
    }

    React.useEffect(() => {
        temporaryPhoneRef.current = temporaryPhone
    }, [temporaryPhone])

    React.useEffect(() => {
        user != undefined &&
            saveInStorage(userStorageKey, JSON.stringify(user))
    }, [user])

    const resendSms = (): Promise<void>  =>  {
        if (registerRequestId.current == undefined || temporaryPhoneRef.current == undefined) return Promise.reject(Error('PleaseEnterPhone'))
        return resendSmsApi(registerRequestId.current)
    }

    const verifyPhone = (verify_code: string ): Promise<void>  =>  {
        if (temporaryPhoneRef.current == undefined || registerRequestId.current == undefined) return Promise.reject()
        return verifyPhoneApi({ request_id: registerRequestId.current, verify_code })
            .then((result) => {
                if (result && result.user && result.token) {
                    setUser(result.user)
                    saveInStorage(tokenStorageKey, result.token)
                } else {
                    throw Error('NotProperResponse')
                }
            })
    }

    const register = ( inputs: RegisterInputs ): Promise<void>  =>  {
        return registerApi(inputs)
            .then((response) => {
                registerRequestId.current = response.request_id
                setTemproryPhone(inputs.mobile)
                return
            })
    }

    const login = (input: { mobile: string, password: string }): Promise<void> => {
        return loginApi(input)
            .then((result) => {
                if (result && result.user && result.token) {
                    setUser(result.user)
                    saveInStorage(tokenStorageKey, result.token)
                } else {
                    throw Error(JSON.stringify(result))
                }
            })
    }

    const forgetPass = ({ mobile }: { mobile: string }): Promise<void> => {
        return forgetPassApi(mobile)
            .then(({ request_id }) => { registerRequestId.current = request_id })
    }

    const resetPassword = ({ newPass, verifyCode }: { newPass: string, verifyCode: string }): Promise<void> => {
        if (registerRequestId.current == undefined) return Promise.reject(Error('PleaseEnterPhone'))

        return resetPasswordApi({
            request_id: registerRequestId.current,
            password: newPass,
            verify_code: verifyCode
        })
    }

    const logout = () => {
        setUser(undefined)
        clearOrderHistory()
        removeFromStorage(userStorageKey)
        removeFromStorage(tokenStorageKey)
    }

    let value: UserContext = {
        user,
        temporaryPhone,
        login,
        logout,
        register,
        resendSms,
        forgetPass,
        addAddress,
        verifyPhone,
        resetPassword,
        getUserAddress
    };

    return <UserContextContainer.Provider value = { value } >{children}</UserContextContainer.Provider>
}

export const useUser = () => React.useContext(UserContextContainer)

export default UserProvider
