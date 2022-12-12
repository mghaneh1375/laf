import { cleanObj, isDev } from './handy'
import { getFromStorage } from './storage'

/**
 * it's a wrapper around fetch function for more control
 * you can use it to set request timeouts
 * better error handling
 * middle ware and intercepting requests
 * parsing after each request
 */

export type ReqInterCeptor = (req: RequestInit) => RequestInit
export type ResponseMiddleWare = (input: BodyWidthStatus<any>) => void
export const tokenStorageKey = 'TokenStorageKey'

var reqInterceptor: ReqInterCeptor | undefined
var resMiddleWare: ResponseMiddleWare | undefined
var reqTimeouts = 10000 //in milli-seconds

type BodyWidthStatus<T> = { json: T, status: number }

function checkStatus<T>({ json, status }: BodyWidthStatus<T>): T {
    if (status >= 200 && status < 300) {
        return json;
    } else {
        isDev() && console.info("server error!", `status code is ${status}`)
        let error = Error()
        throw { ...error, ...json, status }
    }
}

//This function is a little tricky beacuse the most of the apis 
// return the T type in the data proporty but not all of them (.e.g. those with pagination)

function getData<T>(json: { data: T }): T {
    return json.data
}

function parseData<T>(responseBodyAsText: string):T | {} {
    try {
        return JSON.parse(responseBodyAsText);
    } catch (e) {
        isDev() && console.info("parse Error!", responseBodyAsText)
        return {}
    }
}

export function setInterceptor(int: ReqInterCeptor) {
    reqInterceptor = int
}

export function setGlobalHttpTimeout(timeout: number) {
    reqTimeouts = timeout
}

export function setResponseMiddleWare (responseMiddleWare: ResponseMiddleWare) {
    resMiddleWare = responseMiddleWare
}

/**
 * simple http request wrapper for more functionalities
 * @param { Object RequestInfo } input 
 * @param { Object RequestInit & { wholeRootResponse?: boolean }} init - if you use wholeRootResponse it would return the whole content (not ignoring the data)
 * @returns { Promise<T> } return Promise parsed Data (ready to use)
 */
export function http<T>(
    input: RequestInfo,
    init?: RequestInit & { wholeRootResponse?: boolean, 
    timeout?: number } | typeof undefined
): Promise<T> {
    let abortCtrl = new AbortController()
    setTimeout(() => {
        abortCtrl.abort()
    }, init?.timeout || reqTimeouts);

    return getFromStorage(tokenStorageKey)
            .then((token) => { 
                return token
            }).catch(() => {
                return null
            }).then((token) => {
                return {
                    ...init,
                    headers: cleanObj({
                        'Content-Type' : 'application/json',
                        ...(!!init ? init.headers : {}),
                        'Authorization': token ? `Bearer ${token}` : undefined
                    })
                }
            })
            .then((init) => {
                if (reqInterceptor !== null && reqInterceptor !== undefined) { return reqInterceptor({...init}) }
                init.signal?.addEventListener('abort', () => abortCtrl.abort())
                return init
            })
            .then(init =>  { 
                return fetch(input, { ...init, signal: abortCtrl.signal })
            })
            .then((response) => {
                return response.text()
                    .then(parseData)
                    .then((json: any): BodyWidthStatus<T> => { 
                        return  { json: json, status: response.status } 
                    })
            }
            )
            .then((res) => {
                if (resMiddleWare !== null && resMiddleWare !== undefined) { resMiddleWare(res) }
                return res
            })
            .then( r => checkStatus(r))
            .then((r: any) => { 
                if (init?.wholeRootResponse) return r
                return getData<T>(r)
            })
}
