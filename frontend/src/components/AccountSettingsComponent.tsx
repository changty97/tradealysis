import { Component, Fragment } from "react";
import { AccountSettings } from "../cssComponents/AccountSettings";
import axios from "axios";

class AccountSettingsComponent extends Component<any, any>
{
    constructor(props: any)
    {
	    super(props);
	    this.state = { uname: "User", pssd: "", fName: "", lName: "", email: "", phone: "", date: "" };
    }
	
    componentDidMount(): void
    {
        const theKey = localStorage.getItem("Key");
	    if (theKey == null)
	    {
	        this.logout();
	        return;
	    }
        axios.get('http://localhost:3001/accountData', {
	        params: {
	            key: `${theKey}`,
	            }
	        }
	    )
            .then((res) =>
            {
                axios.get('http://localhost:3001/usernameFromKeyGet', {
                    params: {
                        key: `${theKey}`,
                    }
                }
                )
                    .then((res2) =>
                    {
                        const unameVal = res2.data;
                        const val = Object.values(res.data);
                        this.setState((val === null) ? {
                            uname: "",
                            pssd: "",
                            fName: "",
                            lName: "",
                            email: "",
                            phone: "",
                            date: ""
                        } : {
                            uname: (unameVal != null) ? unameVal : "",
                            pssd: (val[1] != null)   ? "" : "",
                            fName: (val[0] != null)   ? val[0] : "",
                            lName: (val[1] != null)   ? val[1] : "",
                            email: (val[2] != null)   ? val[2] : "",
                            phone: (val[3] != null)   ? val[3] : "",
                            date: (val[4] != null)   ? val[4] : ""
                        });
                        this.initalizeTextFields();
                    });
            });
    }

    private initalizeTextFields(): void
    {
        if (document !== null)
        {
            const userName  = (document.getElementById(`myUsername`) as HTMLInputElement);
            const theFName  = (document.getElementById(`myFName`) as HTMLInputElement);
            const theLName  = (document.getElementById(`myLName`) as HTMLInputElement);
            const theEmail = (document.getElementById(`myEmail`) as HTMLInputElement);
            const thePhone = (document.getElementById(`myPhone`) as HTMLInputElement);
            const theBdate = (document.getElementById(`myDate`) as HTMLInputElement);
            if (userName !== null && theFName !== null && theLName !== null && theEmail !== null && thePhone !== null && theBdate !== null)
            {
                userName.value = this.state.uname;
                theFName.value = this.state.fName;
                theLName.value = this.state.lName;
                theEmail.value = this.state.email;
                thePhone.value = this.state.phone;
                theBdate.value = this.state.date;
            }
        }
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
                            <AccountSettings.INPUT type="text" name="myUsername" id="myUsername" />
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
