import { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import { Header } from "../cssComponents/Header";
import { NavBarComponentProps } from "../models/NavBarComponentProps";
import { NavBarComponentState } from "../models/NavBarComponentState";
import Logo from "../images/tradealysis_logo.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';

class NavBarComponent extends Component<NavBarComponentProps, NavBarComponentState>
{
    constructor(props: NavBarComponentProps)
    {
        super(props);
        this.logout = this.logout.bind(this);
    }
	
    private logout() : void
    {
	    localStorage.clear();
	    window.location.href = "/login";
    }

    render(): JSX.Element
    {
        const theUser = (this.props.user) ? this.props.user : "User";
	    return (
	        <Fragment>
	            <header id="allHeader">
	                <Header.THE_HEADER>
                        <div><h1><Link to="/"><img src={Logo} alt="Tradalysis Logo" width="85px" /></Link></h1></div>
	                    <div className="headerButtons">
	                        <Header.HEADER_BUTTONS_LIST>
	                            <Header.HEADER_BUTTONS_LIST_LI>
	                                <Header.LINK_1 to="/">Home</Header.LINK_1>
	                            </Header.HEADER_BUTTONS_LIST_LI>
	                            <Header.HEADER_BUTTONS_LIST_LI>
	                                <Header.LINK_1 to="/report">Reports</Header.LINK_1>
	                            </Header.HEADER_BUTTONS_LIST_LI>
                                <Header.HEADER_BUTTONS_LIST_LI>
	                                <Header.LINK_1 to="/input1">Import</Header.LINK_1>
	                            </Header.HEADER_BUTTONS_LIST_LI>
	                        </Header.HEADER_BUTTONS_LIST>
	                    </div>
	                    <Header.USER_AND_SETTINGS_BUTTONS>
	                        <Header.HEADER_BUTTONS_LIST>
                                <Header.HEADER_BUTTONS_LIST_LI color="#839a9b">
	                                {theUser}
                                </Header.HEADER_BUTTONS_LIST_LI>
	                            <Header.USER_DROP_DOWN>
                                    <FontAwesomeIcon icon={faUserCircle} color="#839a9b" style={{
                                        fontSize: "30px"
                                    }}/>
                                    <Header.USER_DROP_DOWN_CONTENT>
                                        <Header.HEADER_BUTTONS_LIST_LI>
                                            <Header.LINK_1 to="/account">Settings</Header.LINK_1>
                                        </Header.HEADER_BUTTONS_LIST_LI>
                                        <Header.HEADER_BUTTONS_LIST_LI>
                                            <Header.LINK_1 to="" onClick={this.logout}>Logout</Header.LINK_1>
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
export { NavBarComponent };
