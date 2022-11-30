import React from 'react'
import {getErrorMessage, getPrice} from 'lib/handy'
import {Col, Row} from 'react-bootstrap'
import {useMenuContext} from 'store/menuStore'
import {MenuCategoryItem, MenuContent, MenuContentType, MenuFilter, MenuItem} from 'type/menu'
import toast from 'react-hot-toast'
import Loader from "react-loader-spinner";
import ModalMenuItem, {MenuItemModalDataType} from './modalMenuItem'


type CatId = number

type Props = {
    filter: MenuFilter
}

const RestaurantMenu = ({ filter }: Props) => {

    const { updateCategoryContent } = useMenuContext();

    //state
    const [isLoadingMenuItems, setIsLoadingMenuItems] = React.useState<boolean>(false)
    const [visibleMenuItems, setVisibleMenuItems] = React.useState<MenuItem[]>()
    const [activeMenuCategoryIdx, setActiveMenuCategoryIdx] = React.useState<CatId>(-1)
    const [presentingMenuItem, setPresentingMenuItem] = React.useState<MenuItem>()
    const [visibleRootCategories, setVisibleRootCategories] = React.useState<MenuCategoryItem[]>([]);


    //reference
    const isComponentActive = React.useRef<boolean>(true);
    const currentFilter = React.useRef<MenuFilter>(filter);
    const menuIsReady = React.useRef<boolean>(false);

    React.useEffect(() => {
        return () => { isComponentActive.current = false }
    }, []);

    React.useEffect(() => {

        if(activeMenuCategoryIdx < 0) {
            setActiveMenuCategoryIdx(0);
            return;
        }

        setVisibleMenuItems([]);
    }, [activeMenuCategoryIdx, visibleRootCategories]);


    React.useEffect(() => {

        if(activeMenuCategoryIdx < 0)
            return;

        selectCategoryWithItem(activeMenuCategoryIdx);
    }, [visibleMenuItems]);

    React.useEffect(() => {
        currentFilter.current = filter;
        getInitialContent();
    }, [filter]);

    const getInitialContent = () => {
        getInside()
            .then((res) => {
                if (res.type == MenuContentType.Category) {
                    setVisibleRootCategories(filterCategories({ filter: currentFilter.current, cats: res.value }));
                }
            }).catch() //no need to do anything
    };

    const selectCategoryWithItem = (idx) => {

        setIsLoadingMenuItems(true);

        if (visibleRootCategories.length <= idx) return;

        if (hasCategoryItems(visibleRootCategories[idx])) {
            getInside(visibleRootCategories[idx])
                .then((e) => {
                    if (e.type == MenuContentType.Item) setMenuItems(e.value);
                    menuIsReady.current = true;
                    // setActiveMenuCategoryIdx(idx)
                }).catch().finally(() => {
                    setIsLoadingMenuItems(false)
                })
        } else {
            getInside(visibleRootCategories[idx])
                .then((e) => {
                    e.type == MenuContentType.Category && selectSubCategoryWithItem(e.value)
                }).catch()
        }
    };

    const selectSubCategoryWithItem = (cats: MenuCategoryItem[]) => {

        cats.forEach(function (cat) {

            if (hasCategoryItems(cat)) {
                getInside(cat)
                    .then((e) => {
                        if (e.type == MenuContentType.Item) setMenuItems(e.value);
                        menuIsReady.current = true;
                        // setActiveMenuCategoryId(cat.id)
                    }).catch().finally(() => {
                    setIsLoadingMenuItems(false)
                })
            } else {
                getInside(cat)
                    .then((e) => {
                        e.type == MenuContentType.Category && selectSubCategoryWithItem(e.value)
                    }).catch()
            }
        });
    };

    const hasCategoryItems = (cat?: MenuCategoryItem) => cat ? cat.has_items : false

    const setMenuItems = (items: MenuItem[]) => {

        if(visibleMenuItems === undefined)
            return;

        let tmp : MenuItem[] = filterMenuItems({ filter: currentFilter.current, items });

        tmp.forEach(function (itr) {

            let find : boolean = false;

            visibleMenuItems?.forEach(function (itr2) {

                if(find)
                    return;

                if(itr.id === itr2.id) {
                    find = true;
                    return;
                }

            });

            if(!find)
                visibleMenuItems?.push(itr)

        });

    }
    /**
     * get inside of a category, if you pass nothing, it would return the root
     * @param {MenuCategoryItem=} cat
     */
    const getInside = (cat?: MenuCategoryItem): Promise<MenuContent> => {
        return updateCategoryContent({ cat })
            .then((e) => {
                if (isComponentActive.current == false) return e
                if (e.type == MenuContentType.Category) {
                    //no need to do any thing
                } else {
                    setMenuItems(e.value)
                }
                return e
            }).catch((e) => {
                toast.error(getErrorMessage(e));
                throw e
            }).finally(() => {
                if (isComponentActive.current == false) return
            })
    };

    const filterCategories = ({ filter, cats }: { filter: MenuFilter, cats: MenuCategoryItem[] }): MenuCategoryItem[] => {
        return filter == MenuFilter.Booking ? cats.filter((e) => e.is_table == true) :
            filter == MenuFilter.Delivery ? cats.filter((e) => e.is_delivery == true) :
                filter == MenuFilter.TakeOut ? cats.filter((e) => e.is_collect == true) : cats
        // return filter == MenuFilter.Booking ? cats.filter((e) => e.is_table == true) :
        //      cats;
    };

    const filterMenuItems = ({ filter, items }: { filter: MenuFilter, items: MenuItem[] }): MenuItem[] => {

        return items.filter((e) => {
            if (e.is_active == false) return false;
            if (filter == MenuFilter.Booking) return e.is_table && e.eat_in_min_price > 0;
            if (filter == MenuFilter.Delivery) return e.is_delivery && e.delivery_min_price > 0;
            if (filter == MenuFilter.TakeOut) return e.is_collect && e.take_out_min_price > 0;
            return true
        })
    };

    return <div className='menu-container'>
        <Row className='rootCats'>
            <Col md='12'>
                {
                    visibleRootCategories
                        .map((rootCat, index) =>
                                <div key = { index } className = { `${ activeMenuCategoryIdx == index ? 'active-menu-category2' : ''} menu-root-cat-item2` }
                                    onClick= { () => setActiveMenuCategoryIdx(index)}
                                >
                                    <b>{ rootCat.name }</b>
                                </div>
                        )
                }
            </Col>
        </Row>

        <Row>

            <Col md='12'>
                {
                    visibleMenuItems?.length == 0 &&
                    isLoadingMenuItems == false  &&
                    <div className='empty-items-list'>
                        <p>Please choose the items you want</p>
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
                    isLoadingMenuItems == false && visibleMenuItems?.map((e, i) =>
                            <Col className={"floatLeft"} key = { i } md = { 6 }>
                                <div className='my-menu-item menu-item' onClick = { () => { setPresentingMenuItem(e) } }>
                                    <div className='menu-item-info'>
                                        <p>{ e.name }</p>
                                        <p className='price'>{ `£${ getPrice({ item: e, filter }) }` }</p>
                                    </div>
                                    <p className='desc'>{e.description}</p>
                                </div>
                            </Col>
                        )

                }
            </Col>
        </Row>
        <ModalMenuItem
            filterType = { filter }
            input = { presentingMenuItem ? { type: MenuItemModalDataType.Normal, dataSource: presentingMenuItem }: undefined }
            dismiss = { () => setPresentingMenuItem(undefined) }/>
    </div>
};

export default RestaurantMenu
