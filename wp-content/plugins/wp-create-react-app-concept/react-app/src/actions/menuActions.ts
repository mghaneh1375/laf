import { Id, MenuCategoryItem, MenuItem } from "../type/menu";

export enum ActionTypes {
    updateSubCategoryOfCategory = 'updateSubCategoryOfCategory',
    updateItemsOfCategory = 'updateItemsOfCategory'
}

export type CategorySubCatUpdateAction = {
    type: ActionTypes.updateSubCategoryOfCategory
    subCats: MenuCategoryItem[]
    catId?: Id
}

export type CategoryItemsUpdateAction = {
    type: ActionTypes.updateItemsOfCategory
    items: MenuItem[]
    catId: Id
}

export type Action = CategorySubCatUpdateAction | CategoryItemsUpdateAction