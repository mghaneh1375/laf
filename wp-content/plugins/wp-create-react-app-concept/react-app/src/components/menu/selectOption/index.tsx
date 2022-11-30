import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'

//styles
import './styles.scss'

//assets
import checkIcon from 'images/menu/check-icon.png'
import uncheckIcon from 'images/menu/uncheck-icon.png'
import {Id} from "../../../type/menu";

interface MetaData {
    price: number;
    id: Id;
}

export type Option<T extends MetaData> = { index: number, label: string, metaData: T }

type Props<T extends MetaData> = {
    title?: string
    options: Option<T>[]
    disable: boolean
    preSelectIndeX?: number
    onSelect?: (input: {index: number, metaData: T}) => void
}

function SelectOption<T extends MetaData>({ title, options, disable, onSelect, preSelectIndeX }: Props<T>) {

    const [currentSelectedOptionIndex, setCurrentSelectedOptionIndex] = React.useState<number | undefined>(preSelectIndeX)
    const currentOptions = React.useRef<Option<T>[]>(options)

    React.useEffect(() => {
        currentOptions.current = options
    }, [options])

    const onSelectTheOption = ({ index }:{ index: number }) => {
        setCurrentSelectedOptionIndex(index)
        index < currentOptions.current.length && onSelect && onSelect({
            ...currentOptions.current[index]
        })
    }

    return <div className="select-options">
                    { title && <label className='select-option-title textFont1'>{ title }</label>}
                    {
                        !disable && options.map((e, index) => {
                            return <div key = { index } className='select-option-row select-option-row-selectable' onClick = { () => onSelectTheOption({ index }) }>
                                <label className='select-option-label notBold'>{ e.label } </label> <span>{'£' + e.metaData.price.toFixed(2)}</span>
                                <img className='select-option-check-icon' src = { index == currentSelectedOptionIndex ? checkIcon : uncheckIcon }/>
                            </div>
                        })
                    }
                    {
                        disable && options.map((e, index) => {
                            return <div key = { index } className='select-option-row textFont1' onClick = { () => onSelectTheOption({ index }) }>
                                <label className='select-option-label notBold'>{ e.label } </label> <span>{'£' + e.metaData.price.toFixed(2)}</span>
                            </div>
                        })
                    }
    </div>
}

export default SelectOption
