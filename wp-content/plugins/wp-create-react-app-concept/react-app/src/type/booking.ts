export type ActiveBooking = {
    id: string
    start: Date
    end: Date
    number_of_guests: number
    duration: number
    description: string
    status: string
    customer_id: string
    customer_name: string
    branch_id: string
    branch_name: string
    invitations: any[]
}

export type BookAvailableTime = {
    time: Date
    is_available: boolean
    capacity: number
}

export type SubmitingBooking = {
    customer_id: string
    number_of_guests: number
    start: string //date format YYYY-MM-DDTHH:mm:ss
    branch_id: string
    duration?: number
    description?: string
}
