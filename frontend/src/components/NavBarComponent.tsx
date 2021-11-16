import { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import { Header } from "../cssComponents/Header";
import Logo from "../images/tradealysis_logo.png";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';

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
    componentDidMount(): void
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
	                    <div><h1><Link to="/"><img src={Logo} alt="Tradalysis Logo" width="85px" /></Link></h1></div>
	                    <div className="headerButtons">
	                        <Header.HEADER_BUTTONS_LIST>
	                            <Header.HEADER_BUTTONS_LIST_LI>
	                                <Header.LINK_1 to="/home">Home</Header.LINK_1>
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
									{this.state.user}
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
