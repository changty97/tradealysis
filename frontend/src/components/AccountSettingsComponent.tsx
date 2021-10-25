import { Component, Fragment } from "react";
import { AccountSettings } from "../cssComponents/AccountSettings";
import axios from "axios";

const api = axios.create({
    baseURL: 'http://localhost:3001/'
});

class AccountSettingsComponent extends Component<any, any>
{
    constructor(props: any)
    {
	    super(props);
	    this.state = {
	        uname: "",
            pssd: "",
            fName: "",
            lName: "",
            email: "",
            phone: "",
            date: ""
	    };
    }
    componentWillMount(): void
    {
        console.log("mount");
        const theKey = localStorage.getItem("Key");
	    if (theKey == null)
	    {
	        this.logout();
	        return;
	    }
        
        api.get('accountunameFromKeyGET', {
	        params: {
	            key: `${theKey}`,
	            }
	        }
	    )
	    .then((res) =>
	    {
		   this.setState({
                    uname: res.data
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
                <AccountSettings.SECTION>
                    <AccountSettings.ACCOUNT_LIST>
                        <AccountSettings.UL_HORIZ_LIST><AccountSettings.UL_HORIZ_LIST_LI>Your Account</AccountSettings.UL_HORIZ_LIST_LI></AccountSettings.UL_HORIZ_LIST>
                        <AccountSettings.FORM_DIV>
                            <AccountSettings.LABEL>Username:</AccountSettings.LABEL>
                            <AccountSettings.INPUT type="text" name="myUsername" id="myUsername"/>
                            <AccountSettings.LABEL>Password:</AccountSettings.LABEL>
                            <AccountSettings.INPUT type="password" name="myPassword" id="myPassword"/>
                            <AccountSettings.LABEL>First Name:</AccountSettings.LABEL>
                            <AccountSettings.INPUT type="text" name="myFName" id="myFName"/>
                            <AccountSettings.LABEL>Last Name:</AccountSettings.LABEL>
                            <AccountSettings.INPUT type="text" name="myLName" id="myLName"/>
                            <AccountSettings.LABEL>E-mail:</AccountSettings.LABEL>
                            <AccountSettings.INPUT type="email" name="myEmail" id="myEmail" />
                            <AccountSettings.LABEL>Phone:</AccountSettings.LABEL>
                            <AccountSettings.INPUT type="tel" name="Phone" id="myPhone"/>
                            <AccountSettings.LABEL>Birth Date</AccountSettings.LABEL>
                            <AccountSettings.INPUT type="date" name="myDate" id="myDate"/><br/>
                            <AccountSettings.INPUT_LAST_OF_TYPE id="mySubmit" type="Submit"  value="Submit"/>
                        </AccountSettings.FORM_DIV>
                    </AccountSettings.ACCOUNT_LIST>
                </AccountSettings.SECTION>
            </Fragment>
        );
    }
}
export { AccountSettingsComponent };
