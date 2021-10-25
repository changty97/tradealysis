import { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import { Header } from "../cssComponents/Header";
import Logo from "../images/logo_2.jpg";
import axios from "axios";

const api = axios.create({
    baseURL: 'http://localhost:3001/'
});

class NavBarComponent extends Component<any, any>
{
    constructor(props: any)
    {
	    super(props);
	    this.state = {
	        user: "User"
	    };
    }
    componentWillMount(): void
    {
	    const theKey = localStorage.getItem("Key");
	    if (theKey == null)
	    {
	        this.logout();
	        return;
	    }
	    api.get('usernameFromKeyGET', {
	        params: {
	            key: `${theKey}`,
	            }
	        }
	    )
	    .then((res) =>
	    {
		   this.setState({
                    user: res.data
                });
	    });
    }
	
    private logout() : void
    {
	    localStorage.clear();
	    window.location.href = "/login";
    }

    render(): JSX.Element
    {
	    return (
	        <Fragment>
	            <header id="allHeader">
	                <Header.THE_HEADER>
	                    <div><h1><Link to="/home"><img src={Logo} alt="Tradalysis Logo" width="85%" /></Link></h1></div>
	                    <div className="headerButtons">
	                        <Header.HEADER_BUTTONS_LIST>
	                            <Header.HEADER_BUTTONS_LIST_LI>
	                                <Header.LINK_1 to="/home">Home</Header.LINK_1>
	                            </Header.HEADER_BUTTONS_LIST_LI>
	                            <Header.HEADER_BUTTONS_LIST_LI>
	                                <Header.LINK_1 to="/report">Reports</Header.LINK_1>
	                            </Header.HEADER_BUTTONS_LIST_LI>
	                        </Header.HEADER_BUTTONS_LIST>
	                    </div>
	                    <Header.USER_AND_SETTINGS_BUTTONS>
	                        <Header.HEADER_BUTTONS_LIST>
	                            <Header.HEADER_BUTTONS_LIST_LI>
	                                <Header.LINK_1 to="/login">{this.state.user}</Header.LINK_1>
	                            </Header.HEADER_BUTTONS_LIST_LI>
	                            <Header.HEADER_BUTTONS_LIST_LI>
	                                <Header.LINK_1 to="/account">Settings</Header.LINK_1>
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
