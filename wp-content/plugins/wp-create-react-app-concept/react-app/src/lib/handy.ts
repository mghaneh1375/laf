//It's mutating function whic clear empty values of object

import { TimeInterval } from "type/branch";
import { Id, MenuFilter, MenuItem } from "type/menu";
import moment, { Moment } from 'moment'
import {UserAddress} from "../type/user";

/**
 *
 * @param {Object {[x in string]: any}}  obj - the object you wanna clean
 * @param {boolean=} removeEmptyString - if you wanna also to clear the empty strings such as ''
 * @returns {Object} {[x: string]: any;}
 */
export function cleanObj(obj: {[x in string]: any}, removeEmptyString:boolean = false) {
    Object.keys(obj).forEach((key) => (obj[key] === null || obj[key] === undefined || (removeEmptyString && typeof obj[key] == 'string' && obj[key].length === 0)) && delete obj[key])
    return obj
}

//Printing look like 3,000,000 with comma and space
/**
 * @param {string=} digits - string of digit you want to print look like 3,000,000
 * @returns {string}
 */
export const digitSpace = (digits: string): string =>
    digits.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, `$1${','}`);

export const firstLetterUpperCase = (value: string): string =>
    value && value[0].toUpperCase() + value.slice(1)

export const formatPostCode = (value: string): string =>
    value.substr(0, value.length - 3) + " " + value.substr(-3)

const isDevelopment: boolean = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
//Printing look like 3,000,000 with comma and space
/**
 * @returns {boolean} is it's development evnrioment it would return true
 */
export const isDev = (): boolean => isDevelopment

export const addressToString = (address: UserAddress): string => {
    return address.line1 + (address.line2 ? ', ' + address.line2 : '' ) + (address.town ? ', ' + address.town : '') +  ', ' + formatPostCode(address.postal_code);
}

/**
 * @type {string=}
 */
export const REQUEST_BRANCH: () => string | undefined = () => {
    const branch_id = (window as any).branch_id;
    return branch_id ? branch_id : (process.env ? process.env.REACT_APP_BRANCH : undefined);
}
export const BASE_API_URI: () => string | undefined = () => process.env ? process.env.REACT_APP_BASE_URI : undefined

/**
 * split the array into chunked with specified size
 * @param {T} inputArray input array
 * @param chunkSize chunk size
 * @returns
 */
export function chunkArray<T>(inputArray: T[], chunkSize: number): T[][] {
    var index = 0;
    var arrayLength = inputArray.length;
    var tempArray: T[][] = [];

    for (index = 0; index < arrayLength; index += chunkSize) {
        let myChunk = inputArray.slice(index, index+chunkSize);
        tempArray.push(myChunk);
    }
    return tempArray;
}

export function getNumFrom(text: string): number | undefined {
    let themnums = text.match(/\d+[.]\d+/)
    if (themnums && themnums.length > 0) {
        return parseFloat(themnums[0])
    }
    return undefined
}

export function getPrice({item, filter, selectedSizeId}: {item: MenuItem, filter: MenuFilter, selectedSizeId?: Id }): number {
    if (selectedSizeId) {
        let selectedItems = item.sizes.filter(e => e.id == selectedSizeId)
        if (selectedItems.length > 0) {
            if (filter == MenuFilter.Delivery && selectedItems[0].delivery_price != null) {
                let price = getNumFrom(selectedItems[0].delivery_price)
                if (price) return price
            }
            else if (filter == MenuFilter.Booking && selectedItems[0].table_price != null) {
                let price = getNumFrom(selectedItems[0].table_price)
                if (price) return price
            }
            else if (filter == MenuFilter.TakeOut && selectedItems[0].collect_price != null) {
                let price = getNumFrom(selectedItems[0].collect_price)
                if (price) return price
            }
        }
    }
    if ( filter == MenuFilter.Delivery && !!item.delivery_min_price) return item.delivery_min_price
    else if( filter == MenuFilter.TakeOut && !!item.take_out_min_price) return item.take_out_min_price
    else if( filter == MenuFilter.Booking && !!item.eat_in_min_price) return item.eat_in_min_price

    return 0
}
/**
 * fix the number of decimals of digits (remove them)
 * @param digit
 * @param decimal
 * @returns
 */
export function toFixed(digit: number, decimal: number): number {
    if (decimal <= 1) return Math.floor(digit)
    return Math.floor(digit * Math.pow(10, decimal)) / Math.pow(10, decimal);
}

const emailRegx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export function validateEmail(email: string): boolean {
    return emailRegx.test(String(email).toLowerCase());
}

export function validatePostcode(postcode: string) {
    postcode = postcode.replace(/\s/g, "");
    const regex = /^[A-Z]{1,2}[0-9]{1,2}[A-Z]{0,1} ?[0-9][A-Z]{2}$/i;
    return regex.test(postcode);
}

export const getErrorMessage = (e: any) => {
    let message = 'There is problem in server connection';
    if(e && typeof e.message == 'string'){
        message = e.message;
        if(e.hasOwnProperty('errors') && typeof e.errors == 'object'){
            message = e.errors[Object.keys(e.errors)[0]];
        }
    }
    return message;
}

/**
 *
 * @param { moment.Moment} now  assumptioning now time (it can be not real now!)
 * @param { TimeInterval } interval the time intervals for searching available times from
 * @returns { moment.Moment[] } it would return the array of moments to select with user
 */
export const getAvailableDeliverTimes = ({ now, intervals, startDelay }: { now: moment.Moment, intervals: TimeInterval[], startDelay: number }): moment.Moment[] => {
    let result: moment.Moment[] = [];
    now.minute((Math.floor(now.minutes()/15.3) + 1) * 15); // start now with rounded minutes 12:00, 12:15, 12:45, ...
    now.add(startDelay, 'm');
    let end = moment().add(1, 'day').hour(12).minute(0).second(0);

    let weekday = new Array(7);
    weekday["Monday"] = 1;
    weekday["Tuesday"]= 2;
    weekday["Wednesday"] = 3;
    weekday["Thursday"] = 4;
    weekday["Friday"] = 5;
    weekday["Saturday"] = 6;
    weekday["Sunday"] = 7;

    while(end.isAfter(now)){

        if(intervals.some(time => {

            if(weekday[time.week_day] < now.day() ||
                weekday[time.week_day] > now.day() + 1)
                return false;

            // if(time.week_day != now.format('dddd')) return false;
            let start_ = moment(now.format('YYYY-MM-DD')+' ' + time.start_time);
            let end_ = moment(now.format('YYYY-MM-DD')+' ' + time.finish_time);

            if(now.format('dddd') != time.week_day)
                return false;

            if(now.isAfter(start_) && now.isBefore(end_)) return true;
            return false;
        })) result.push(now);
        now = moment(now).add(15, 'm');
    }
    return result;
}

/**
 *
 * @param { string } input the string that you want to remove the white spaces from
 * @returns { string }
 */
export const removeWhiteSpace = (input: string): string => input.replace(/ /g,'')
