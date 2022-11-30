import { REQUEST_BRANCH, BASE_API_URI } from "lib/handy";
import { http } from "lib/http";
import { ResturantBranchInfo, PostCodeAddress } from "type/branch";

var cachedContent: ResturantBranchInfo | undefined

export async function getResturantBranchInfo(dont_cache:boolean = false): Promise<ResturantBranchInfo> {
    if (cachedContent != undefined && !dont_cache) return Promise.resolve(cachedContent)
    return http<ResturantBranchInfo>(`${BASE_API_URI()}/api/v2/cm/branches/${REQUEST_BRANCH()}`)
            .then(res => {
                cachedContent = res
                return res
            })
}

export async function searchForPostCodeApi({ postCode, signal }: { postCode: string, signal?: AbortSignal }): Promise<PostCodeAddress[]> {
    return http<PostCodeAddress[]>(`${BASE_API_URI()}/api/v2/postcode/find?postal_code=${ postCode }`, { signal })
}
