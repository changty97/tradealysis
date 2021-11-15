import { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import { Header } from "../cssComponents/Header";
import Logo from "../images/tradealysis_logo.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';

class NavBarLoginComponent extends Component
{
    render(): JSX.Element
    {
        return (
            <Fragment>
                <header id="allHeader">
                    <Header.THE_HEADER>
                        <div><h1><Link to="/home"><img src={Logo} alt="Tradalysis Logo" width="85px" /> </Link></h1></div>
                        <div className="headerButtons">
                            <Header.HEADER_BUTTONS_LIST>
                                <Header.HEADER_BUTTONS_LIST_LI>
                                    <Header.LINK_1 to="/">Home</Header.LINK_1>
                                </Header.HEADER_BUTTONS_LIST_LI>
                                <Header.HEADER_BUTTONS_LIST_LI>
                                    <Header.LINK_1 to="/about">About</Header.LINK_1>
                                </Header.HEADER_BUTTONS_LIST_LI>
                            </Header.HEADER_BUTTONS_LIST>
                        </div>
                        <Header.USER_AND_SETTINGS_BUTTONS>
                            <Header.HEADER_BUTTONS_LIST>
                                <Header.HEADER_BUTTONS_LIST_LI>
                                    <Header.LINK_1 to="/login">Login</Header.LINK_1>
                                </Header.HEADER_BUTTONS_LIST_LI>
                                <Header.USER_DROP_DOWN>
                                    <FontAwesomeIcon icon={faUserCircle} />
                                    <Header.USER_DROP_DOWN_CONTENT>
                                        <Header.HEADER_BUTTONS_LIST_LI>
                                            <Header.LINK_1 to="/account">Settings</Header.LINK_1>
                                        </Header.HEADER_BUTTONS_LIST_LI>
                                    </Header.USER_DROP_DOWN_CONTENT>
                                </Header.USER_DROP_DOWN>
                            </Header.HEADER_BUTTONS_LIST>
                        </Header.USER_AND_SETTINGS_BUTTONS>
                    </Header.THE_HEADER>
                </header>
            </Fragment>
        );
    }
}
export { NavBarLoginComponent };
