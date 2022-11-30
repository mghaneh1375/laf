import { BASE_API_URI, cleanObj, REQUEST_BRANCH } from "lib/handy";
import { http } from "lib/http";
import moment from "moment";
import { ActiveBooking, BookAvailableTime, SubmitingBooking } from "type/booking";


export async function getActiveBookingApi(): Promise<ActiveBooking> {
    return http<ActiveBooking>(`${BASE_API_URI()}/api/v2/cm/reservations/active`)
}

export async function cancelActiveBookingApi(id: string): Promise<void> {
    return http<void>(`${BASE_API_URI()}/api/v2/cm/reservations/${id}/cancel`, {
        method: 'POST'
    })
}

export async function getAvailableBookingTimeApi({date, signal}: { date: moment.Moment, signal?: AbortSignal }): Promise<BookAvailableTime[]> {
    return http<BookAvailableTime[]>(`${BASE_API_URI()}/api/v2/cm/reservations/available-times?branch_id=${REQUEST_BRANCH()}&date=${date.format('YYYY-MM-DDTHH:mm:ss')}`, { signal })
}

export async function submitBookingApi(input: SubmitingBooking): Promise<ActiveBooking> {
    return http<ActiveBooking>(`${BASE_API_URI()}/api/v2/cm/reservations`, {
        method: 'POST',
        body: JSON.stringify(cleanObj(input))
    })
}
