import React from "react";
import {ReactComponent as LogIcon} from "../../assets/icons/log.svg";

const Logbox = () => {
    return (
        <div className="app-log" style={{position: 'fixed', left: '30px', top: '14px'}}>
            <span>
                <LogIcon />
            </span>
        </div>
    );
};

export default Logbox;