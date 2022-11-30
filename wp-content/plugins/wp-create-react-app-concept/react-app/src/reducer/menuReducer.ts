import { Action, ActionTypes } from "actions/menuActions";
import { MenuContentType, MenuStore } from "type/menu";

export const menuStoreInitializeContent: MenuStore = {
    rootCategories: [],
    fetchedCategoryContents: {}
}

export const menuStoreReducer = (state: MenuStore = menuStoreInitializeContent, action: Action): MenuStore => {
    switch (action.type) {
        case ActionTypes.updateSubCategoryOfCategory: 
            if (action.catId === undefined) {
                return {
                    ...state,
                    rootCategories: action.subCats
                }
            } else {
                return {
                    ...state,
                    fetchedCategoryContents: {
                        ...state.fetchedCategoryContents,
                        [action.catId]: {
                            type: MenuContentType.Category,
                            value: action.subCats
                        }
                    }
                }
            }
        case ActionTypes.updateItemsOfCategory:
            return {
                ...state,
                fetchedCategoryContents: {
                    ...state.fetchedCategoryContents,
                    [action.catId]: {
                        type: MenuContentType.Item,
                        value: action.items
                    }
                }
            }
    }
    return state
}