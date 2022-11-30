import React, { CSSProperties } from "react";
import { Form, FormControlProps, InputGroup } from 'react-bootstrap'



const PasswordField = (props: FormControlProps & { required: boolean, name: string, placeholder: string }) => {

    const [inputType, setInputType] = React.useState<'password' | 'text'>('password')
    const handleClick = () => setInputType((type) => (type === 'text' ? 'password' : 'text'))

    return <InputGroup>
        <Form.Control { ...props } type = { inputType }/>
        <InputGroup.Append>
            <InputGroup.Text style = { styles.cursorPointer } onClick = { handleClick }>{ inputType == 'password' ?  'Show Password': 'Hide password' }</InputGroup.Text>
        </InputGroup.Append>
    </InputGroup>
}

const styles: { [x in string]: CSSProperties } = {
    cursorPointer: {
        cursor: 'pointer'
    }
}

export default PasswordField