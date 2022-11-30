import { http } from "lib/http";
import { MenuCategoryItem, MenuItem } from "type/menu";
import { REQUEST_BRANCH, BASE_API_URI } from "lib/handy";

export async function getMenuCategories({ parentCategory, abortSignal }: {parentCategory?: MenuCategoryItem, abortSignal?: AbortSignal}): Promise<MenuCategoryItem[]> {
    if (!!parentCategory && (parentCategory.has_items == true )) return Promise.reject(Error('WrongRequest'))
    return http<MenuCategoryItem[]>(
        `${BASE_API_URI()}/api/v2/cm/branches/${REQUEST_BRANCH()}/categories${ parentCategory ? '?parent_id=' + parentCategory.id : '' }`,
        { signal: abortSignal }
    )
}

export async function getMenuItem({ category, abortSignal }: {category: MenuCategoryItem, abortSignal?: AbortSignal}): Promise<MenuItem[]> {
    if (category.has_items == false) return Promise.reject(Error('WrongRequest'))
    return http<MenuItem[]>(`${BASE_API_URI()}/api/v2/cm/branches/${REQUEST_BRANCH()}/items?category_id=${ category.id }`, {
        signal: abortSignal
    })
}