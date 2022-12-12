import React from 'react'
import {chunkArray, getErrorMessage, getPrice} from 'lib/handy'
import { Row, Col } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useMenuContext } from 'store/menuStore'
import {
    MenuCategoryItem,
    MenuFilter,
    MenuItem,
    MenuContent,
    MenuContentType
} from 'type/menu'
import toast from 'react-hot-toast'
import Loader from "react-loader-spinner";

//styles
import ModalMenuItem, { MenuItemModalDataType } from './modalMenuItem'
import useWindowDimensions from "./windowDimension";

type SubCatId = string

type Props = {
    filter: MenuFilter
    onAddBasket?: ({}: {sizeIndex: number, quantity: number, item: MenuItem}) => void
}

const RestaurantMenu = ({ filter, onAddBasket }: Props) => {

    //hooks
    const { t } = useTranslation()
    const { updateCategoryContent, fetchedCategoryContents, rootCategories } = useMenuContext()

    const { height, width } = useWindowDimensions();

    //state
    const [isLoadingMenuItems, setIsLoadingMenuItems] = React.useState<boolean>(false)
    const [visibleMenuItems, setVisibleMenuItems] = React.useState<MenuItem[][]>([])
    const [isLoadingSubcat, setIsLoadingSubcat] = React.useState<{ [x in SubCatId]: boolean }>({})
    const [visibleSubCats, setVisibleSubCats] = React.useState<{ [x in SubCatId]: boolean }>({})
    const [activeMenuCategoryId, setActiveMenuCategoryId] = React.useState<SubCatId>()
    const [presentingMenuItem, setPresentingMenuItem] = React.useState<MenuItem>()

    //reference
    const isComponentActive = React.useRef<boolean>(true)
    const currentFilter = React.useRef<MenuFilter>(filter)
    const menuIsReady = React.useRef<boolean>(false);
    const [ menuItemsInRow, setMenuItemsInRow ] = React.useState<number>(width < 1300 ? 2 : 3);
    //consts

    React.useEffect(() => {
        return () => { setMenuItemsInRow(width < 1300 ? 2 : 3) }
    }, [width]);

    React.useEffect(() => {
        return () => { isComponentActive.current = false; }
    }, []);

    React.useEffect(() => {
        currentFilter.current = filter;
        setVisibleSubCats({});
        getInitialContent()
    }, [filter, width]);

    const getInitialContent = () => {
        getInside()
            .then((res) => {
                if (res.type == MenuContentType.Category) {
                    selectTheFirstCategoryWithItem(filterCategories({ cats: res.value, filter: currentFilter.current }))
                }
            }).catch() //no need to do anything
    };

    const selectTheFirstCategoryWithItem = (cats: MenuCategoryItem[]) => {
        if (cats.length == 0) return;
        if (hasCategoryItems(cats[0])) {
            getInside(cats[0])
                .then((e) => {
                    if (e.type == MenuContentType.Item) setMenuItems(e.value);
                    menuIsReady.current = true;
                    setActiveMenuCategoryId(cats[0].id)
                }).catch()
        } else {
            getInside(cats[0])
                .then((e) => {
                    setVisibleSubCats(p => ({
                        ...p,
                        [cats[0].id]: p[cats[0].id] ? ![cats[0].id] : true
                    }));
                    e.type == MenuContentType.Category && selectTheFirstCategoryWithItem(e.value)
                }).catch()
        }
    };

    const hasCategoryItems = (cat?: MenuCategoryItem) => cat ? cat.has_items : false

    const setMenuItems = (items: MenuItem[]) => {
        setVisibleMenuItems(chunkArray(filterMenuItems({ filter: currentFilter.current, items }) ,menuItemsInRow))
    };
    /**
     * get inside of a category, if you pass nothing, it would return the root
     * @param {MenuCategoryItem=} cat
     */
     const getInside = (cat?: MenuCategoryItem): Promise<MenuContent> => {
        if (hasCategoryItems(cat)) {
            setIsLoadingMenuItems(true)
        } else {
            setIsLoadingSubcat(p => ({ ...p, [cat?.id || 'root']: true}))
        }
        return updateCategoryContent({ cat })
            .then((e) => {
                if (isComponentActive.current == false) return e
                if (e.type == MenuContentType.Category) {
                   //no need to do any thing
                } else {
                    setMenuItems(e.value)
                    cat?.id && setActiveMenuCategoryId(cat.id)
                }
                return e
            }).catch((e) => {
                toast.error(getErrorMessage(e))
                throw e
            }).finally(() => {
                if (isComponentActive.current == false) return
                if (hasCategoryItems(cat)) {
                    setIsLoadingMenuItems(false)
                } else {
                    setIsLoadingSubcat(p => ({
                        ...p,
                        [cat?.id || 'root']: false
                    }))
                }
            })
    }

    const toggleVisibilityForSubCat = (cat: MenuCategoryItem, isRootCat: boolean) => {
        if (menuIsReady.current == false) return;
        if (activeMenuCategoryId && cat && activeMenuCategoryId == cat.id) return;
        //has not been fetched before

        setActiveMenuCategoryId(cat.id);

        if(isRootCat)
            setVisibleSubCats({});

        if (visibleSubCats[cat.id] == undefined) { getInside(cat).catch() }

        hasCategoryItems(cat) == false && setVisibleSubCats(p => ({
            ...p,
            [cat.id]: p[cat.id] ? !p[cat.id] : true
        }))
    };

    const filterCategories = ({ filter, cats }: { filter: MenuFilter, cats: MenuCategoryItem[] }): MenuCategoryItem[] => {
        let filteredContent: MenuCategoryItem[] = filter == MenuFilter.Booking ? cats.filter((e) => e.is_table == true) :
        filter == MenuFilter.Delivery ? cats.filter((e) => e.is_delivery == true) :
        filter == MenuFilter.TakeOut ? cats.filter((e) => e.is_collect == true) : cats
        return filteredContent
    };

    const filterMenuItems = ({ filter, items }: { filter: MenuFilter, items: MenuItem[] }): MenuItem[] => {
        let filteredContent = items.filter((e) => {
            if (e.is_active == false) return false
            if (filter == MenuFilter.Delivery) return e.is_delivery && e.delivery_min_price > 0
            if (filter == MenuFilter.TakeOut) return e.is_collect && e.take_out_min_price > 0
            if (filter == MenuFilter.Booking) return e.is_table && e.eat_in_min_price > 0
            return true
        })
        return filteredContent
    };

    const renderSubCategoryContent = ({ cat, level }: {cat: MenuCategoryItem, level: number}) => {
        return <div>
            {
                isLoadingSubcat[cat.id] == true &&
                fetchedCategoryContents[cat.id] == undefined &&
                <div className='loading-subcategories'>
                    <Loader
                        type="BallTriangle"
                        color="#00BFFF"
                        height={50}
                        width={50}
                    />
                </div>
            }
            {(() => {
                let content = fetchedCategoryContents[cat.id]
                if (content != undefined && content.type === MenuContentType.Category) {
                    let filteredContent = filterCategories({ filter, cats: content.value })
                    return <div>
                        <div className = { `sub-category-content ${ visibleSubCats[cat.id] ? '': 'hidden' } level-${level}` } >
                        {
                            filteredContent
                                .map((subCat, i) => <div key = { i }>
                                    <div key = { i } cat-id = { `${subCat.id}` } className={ `menu-subcategory-item ${activeMenuCategoryId == subCat.id ? 'active-menu-category' : ''}` }
                                        onClick = { () => toggleVisibilityForSubCat(subCat, false) } >
                                        <p>{ subCat.name }</p>
                                    </div>
                                    { hasCategoryItems(subCat) == false && i != filteredContent.length - 1 && renderSubCategoryContent({ cat: subCat, level: level + 1}) }
                                </div>)
                        }
                        </div>
                        {
                            visibleSubCats[cat.id] == true &&
                            filteredContent.length > 0 &&
                            hasCategoryItems(filteredContent[filteredContent.length - 1]) == false &&
                            renderSubCategoryContent({ cat: filteredContent[filteredContent.length - 1], level: level + 1})
                        }
                    </div>
                }
            })()}
        </div>
    }

    let visibleRootCategories = filterCategories({ filter, cats: rootCategories })
    return <div className='menu-container'>
        <Row>
            <Col md='4'>
                {/*<h1 className='menu-title'>{ t('MenuTitle') }</h1>*/}
                <h1 className='menu-title'>{ t('TakeOutTitle') }</h1>
                {
                    visibleRootCategories.length == 0 &&
                    isLoadingSubcat['root'] == true &&
                    <div className='loading-item-wrapper'>
                        <Loader
                            type="Oval"
                            color="#00BFFF"
                            height={50}
                            width={50}
                        />
                    </div>
                }
                {
                    visibleRootCategories.length == 0 &&
                    isLoadingSubcat['root'] == false &&
                    <div className='loading-item-wrapper'>
                        <p>Please refresh the screen!</p>
                    </div>
                }
                {
                    visibleRootCategories
                        .map((rootCat, index) => <div key = { index }>
                            <div key = { index } className = { `${ activeMenuCategoryId == rootCat.id ? 'active-menu-category' : ''} menu-root-cat-item` }
                                onClick = { () => toggleVisibilityForSubCat(rootCat, true) }>
                                <b>{ rootCat.name }</b>
                            </div>
                            { renderSubCategoryContent({ cat: rootCat, level: 0 }) }
                        </div>
                    )
                }
            </Col>
            <Col md='8'>
                {
                    visibleMenuItems.length == 0 &&
                    isLoadingMenuItems == false  &&
                    <div className='empty-items-list'>
                        <p>Please choose the categories you want</p>
                    </div>
                }
                { isLoadingMenuItems == true && <div className='empty-items-list'>
                    <Loader
                        type="Grid"
                        color="#00BFFF"
                        height={50}
                        width={50}
                    />
                    </div>
                }
                {
                    isLoadingMenuItems == false && visibleMenuItems
                        .map((itemsRow, i) =>
                            <div key = { i }>
                                <Row className="align-in-menu">
                                {
                                    itemsRow.map((e, j) => <Col key = { j } md = { 12 / menuItemsInRow }>
                                        <div className='menu-item' onClick = { () => { setPresentingMenuItem(e) } }>
                                            <img className='menu-item-image' src= { e.img_full_url } />
                                            <div className='menu-item-info'>
                                                <p className='textFont1'>{ e.name }</p>
                                                <p className='textFont1 price'>{ `£${ getPrice({ item: e, filter }) }` }</p>
                                            </div>
                                        </div>
                                    </Col>)
                                }
                                </Row>
                            </div>
                        )
                }
            </Col>
        </Row>
        <ModalMenuItem
            filterType = { filter }
            input = { presentingMenuItem ? { type: MenuItemModalDataType.Normal, dataSource: presentingMenuItem }: undefined }
            dismiss = { () => setPresentingMenuItem(undefined) }/>
    </div>
}

export default RestaurantMenu
