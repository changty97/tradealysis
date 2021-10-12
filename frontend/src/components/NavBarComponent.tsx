import { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import { Header } from "../cssComponents/Header";
import Logo from "../images/logo_2.jpg";

class NavBarComponent extends Component
{
    private logout() : void
    {
        localStorage.clear();
        window.location.reload();
    }
    render(): JSX.Element
    {
        let userName = localStorage.getItem("username");
		userName = (userName == null) ? "User" : userName; // we will remove this later
		
		let userNameFirstChar = userName[0].toUpperCase();
		userName = (userNameFirstChar + (userName.substring(1)).toLowerCase());
		
		/**
			This will be used once we are all using the same database (online)
			if (userName == null) {
				this.logout();
			}
		**/
        return (
            <Fragment>
                <header id="allHeader">
                    <Header.THE_HEADER>
                        <div>
                            <h1>
                                <Link to="/home">
                                    <img src={Logo} alt="Tradalysis Logo" width="85%" />
                                </Link>
                            </h1>
                        </div>
                        <div className="headerButtons">
                            <Header.HEADER_BUTTONS_LIST>
                                <Header.HEADER_BUTTONS_LIST_LI>
                                    <Header.LINK_1 to="/home">
                                        <Header.HEADER_BUTTONS_LIST_LI_A>Home</Header.HEADER_BUTTONS_LIST_LI_A>
                                    </Header.LINK_1>
                                </Header.HEADER_BUTTONS_LIST_LI>
                                <Header.HEADER_BUTTONS_LIST_LI>
                                    <Header.LINK_1 to="/report">
                                        <Header.HEADER_BUTTONS_LIST_LI_A>Reports</Header.HEADER_BUTTONS_LIST_LI_A>
                                    </Header.LINK_1>
                                </Header.HEADER_BUTTONS_LIST_LI>
                            </Header.HEADER_BUTTONS_LIST>
                        </div>
                        <Header.USER_AND_SETTINGS_BUTTONS>
                            <Header.HEADER_BUTTONS_LIST>
                                <Header.HEADER_BUTTONS_LIST_LI>
                                    <Header.LINK_1 to="/login"> {/* Replace with correct routing when they're created */}
                                        <Header.HEADER_BUTTONS_LIST_LI_A>{userName}</Header.HEADER_BUTTONS_LIST_LI_A>
                                    </Header.LINK_1>
                                </Header.HEADER_BUTTONS_LIST_LI>
                                <Header.HEADER_BUTTONS_LIST_LI>
                                    <Header.LINK_1 to="/account"> {/* Replace with correct routing when they're created */}
                                        <Header.HEADER_BUTTONS_LIST_LI_A>Settings</Header.HEADER_BUTTONS_LIST_LI_A>
                                    </Header.LINK_1>
                                </Header.HEADER_BUTTONS_LIST_LI>
								 <Header.LOGOUT_BUTTON onClick={this.logout}>Logout</Header.LOGOUT_BUTTON>
                            </Header.HEADER_BUTTONS_LIST>
                        </Header.USER_AND_SETTINGS_BUTTONS>
                    </Header.THE_HEADER>
                </header>
            </Fragment>
        );
    }
}
export { NavBarComponent };
