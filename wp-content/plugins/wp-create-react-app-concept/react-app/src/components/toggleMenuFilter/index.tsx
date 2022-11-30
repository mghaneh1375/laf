import React from 'react'
import { Breadcrumb, Button, ButtonGroup } from 'react-bootstrap'
import { MenuFilter } from 'type/menu'

//styles
import './style.scss'

type Props = {
    is_delivery_active: boolean | undefined
    is_take_out_active: boolean | undefined
    filter: MenuFilter
    attemptChangeFilter: (newValue: MenuFilter) => void
}

const ToggleMenuFilter = ({ is_delivery_active, is_take_out_active, filter, attemptChangeFilter }: Props) => {
    return <Breadcrumb>
        <div className = 'filter-menu-wrapper'>
            <em>Change the order type here</em>
            <ButtonGroup aria-label="menu filter" className='menu-filter-buttons'>

                {is_delivery_active == true &&
                    <Button onClick = { () => attemptChangeFilter(MenuFilter.Delivery) }
                            active = { filter == MenuFilter.Delivery }
                            variant="secondary">Delivery</Button>
                }

                {is_take_out_active == true &&
                    <Button onClick={() => attemptChangeFilter(MenuFilter.TakeOut)}
                            active={filter == MenuFilter.TakeOut}
                            variant="secondary">Take Out</Button>
                }
            </ButtonGroup>
        </div>
    </Breadcrumb>
}

export default ToggleMenuFilter
