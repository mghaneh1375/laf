import React from 'react'
import {useHistory} from "react-router-dom";

const Redirector = () => {

    const history = useHistory();
    history.go(-2);

    return <div />
};

export default Redirector