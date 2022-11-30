/**
 * There are some definitions here which it seems it would be necessary to have a descriptoin
 *
 * @param {boolean} is_table it means this category || item can be delivered inside of resturant (Eat In)
 * @param {boolean} is_collect it means this category || item can be delivered inside of resturant - but! for outside (Take out)
 * @param {boolean} is_delivery it means this category || item can be delivered by delivery server (Delivery)
 */

export type Id = string
export type Name = string | null
export type ServiceConst = string | null //it can be null if the service is not available!

export type MenuCategoryItem = {
    id: Id
    order: number // the order of sorting - it would be useless (it seems)
    name: Name
    img_full_url: string
    is_table: boolean
    is_collect: boolean
    is_delivery: boolean //mean has! delivery
    has_items: boolean // if it's false then this is a cateogory of other categories, but if it's true then it's a catory of items
    is_active: boolean
    parent_id: string | null // if the category is a root one, then there would be no parent category id
    partner_id: string | null
    has_ingredients: boolean
    size_names: string[]
}

export type MenuItemSize = {
    id: Id
    name: Name
    is_active: boolean
    description: string
    table_price: ServiceConst
    collect_price: ServiceConst
    delivery_price: ServiceConst
}

export type MenuItem = {
    id: Id
    order: number
    name: Name
    description: string
    category_id: string
    partner_id: string
    is_active: boolean
    is_table: boolean
    is_collect: boolean
    is_delivery: boolean
    img_full_url: string
    eat_in_min_price: number
    take_out_min_price: number
    delivery_min_price: number
    sizes: MenuItemSize[],
    default_ingredients: Id[]
    updated_at: Date
    created_at: Date
}

export enum MenuFilter { //it would be better to be renamed to OrderType
    Delivery = 'delivery',
    TakeOut = 'takeout',
    Booking = 'booking'
}

// Store

export enum MenuContentType {
    Category, Item
}

export type MenuContent = {
    type: MenuContentType.Category
    value: MenuCategoryItem[]
} | {
    type: MenuContentType.Item
    value: MenuItem[]
}

export type MenuStore = {
    rootCategories: MenuCategoryItem[]
    fetchedCategoryContents: { [x in Id]: MenuContent }
}

export type MenuContext = MenuStore & {
    //if you pass no cat it would update the root categories
    updateCategoryContent: (_e:{ cat?: MenuCategoryItem, catId?: Id, signal?: AbortSignal }) => Promise<MenuContent>
}
