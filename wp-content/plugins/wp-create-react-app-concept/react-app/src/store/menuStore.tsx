import React from 'react'
import { ActionTypes } from '../actions/menuActions'
import { MenuCategoryItem, MenuContext, MenuContent, MenuContentType, MenuStore } from 'type/menu'
import { getMenuCategories, getMenuItem } from './webServiceApi/menu'
import { menuStoreReducer, menuStoreInitializeContent } from 'reducer/menuReducer'

const MenuContextContainer = React.createContext<MenuContext>({
    rootCategories: [],
    fetchedCategoryContents: {},
    updateCategoryContent: () => { throw Error('You are using the context out of provider') }
})

const MenuProvider = ({ children }: { children: React.ReactNode }) => {

    const [menuContextStore, dispatch] = React.useReducer(menuStoreReducer, menuStoreInitializeContent)
    const contextStoreRef = React.useRef<MenuStore>(menuContextStore)

    React.useEffect(() => {
        contextStoreRef.current = menuContextStore
    }, [menuContextStore])

    const updateCategoryContent = ({ cat, signal }: { cat?: MenuCategoryItem, signal?: AbortSignal }): Promise<MenuContent> => {
        let currentMenuStore = contextStoreRef.current
        if (cat !== undefined && currentMenuStore.fetchedCategoryContents[cat.id] !== undefined)
            return Promise.resolve(currentMenuStore.fetchedCategoryContents[cat.id])
        if (!!cat && cat.has_items == true) {
            return getMenuItem({ category: cat, abortSignal: signal})
                .then((res) => {
                    if (typeof res === 'object' && res.length > 0) {
                        dispatch({
                            type: ActionTypes.updateItemsOfCategory,
                            items: res,
                            catId: cat.id
                        })

                        return {
                            type: MenuContentType.Item,
                            value: res
                        }
                    }
                    throw Error('NotProperResponse')
                })
        }
        
        if (cat === undefined && currentMenuStore.rootCategories.length > 0) 
            return Promise.resolve({
                type: MenuContentType.Category,
                value: currentMenuStore.rootCategories
            })
        return getMenuCategories({ parentCategory: cat, abortSignal: signal })
            .then((res) => {  
                //update the store
                if (typeof res === 'object' && res.length > 0) {
                    dispatch({
                        type: ActionTypes.updateSubCategoryOfCategory,
                        subCats: res,
                        catId: cat !== undefined ? cat.id : undefined
                    })
                    
                    return {
                        type: MenuContentType.Category,
                        value: res
                    }
                }
                throw Error('NotProperResponse')
            })

    }

    const value: MenuContext = { 
        ...menuContextStore,
        updateCategoryContent
    }
    return <MenuContextContainer.Provider value = { value } >{children}</MenuContextContainer.Provider>
}

export const useMenuContext = () => React.useContext(MenuContextContainer)

export default MenuProvider