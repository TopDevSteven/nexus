import React from "react";
import { Link } from "react-router-dom";
import { ReactComponent as SettingIcon} from "../../assets/icons/setting.svg";
import { ReactComponent as SearchIcon} from "../../assets/icons/search.svg";
import { ReactComponent as NoticIcon} from "../../assets/icons/notice.svg";
import { ReactComponent as NoticPointIcon} from "../../assets/icons/noticepoint.svg"

const Header = () => {
    return (
        <div className="app-header">
            <div className="btn-group">
                {/* <Link to="/"></Link>
                <Link to="/">Search</Link>
                <Link to="/">Login</Link> */}
                <span><NoticIcon />
                    <div className="notice-circle">
                        <NoticPointIcon />
                    </div>
                </span>
                <span><SearchIcon /></span>
                <span><SettingIcon /></span>
            </div>
        </div>
    );
};

export default Header;
