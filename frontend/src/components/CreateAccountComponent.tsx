import { Component, Fragment } from "react";
import { AccountSettings } from "../cssComponents/AccountSettings";
import { api } from "../constants/globals";

class CreateAccountComponent extends Component<any, any>
{
    constructor(props: any)
    {
	    super(props);
        this.createAccount = this.createAccount.bind(this);
    }
	
    /**
		Method finds id elements from CreateAccountComponent
		If they are found, we do the following:
		1. check the len userName value. if less then 0, this is
		   an invalid possible username
		2. Try to post data to backend with axios.post
		3. If 0 is returned, their is a problem. The only
		   problem that could have happened at this point is
		   db is not implemented properly (not likely), db
		   will not connect, or username is already associated
		   with an account.
		   - On success: redirect to login pageX
		   - On fail:    clears form onscreen
		                 by reloading ./login page
	**/
    private createAccount(): void
    {
        if (document != null)
	    {
            const userName  = (document.getElementById(`myUsername`) as HTMLInputElement);
	        const passWord  = (document.getElementById(`myPassword`) as HTMLInputElement);
            const firstName = (document.getElementById(`myFName`) as HTMLInputElement);
            const lastName  = (document.getElementById(`myLName`) as HTMLInputElement);
            const emailAddr = (document.getElementById(`myEmail`) as HTMLInputElement);
            const phoneNum  = (document.getElementById(`myPhone`) as HTMLInputElement);
            const myBdate   = (document.getElementById(`myDate`) as HTMLInputElement);
			
            if (userName !== null && passWord !== null && firstName !== null &&
			   lastName !== null && emailAddr !== null && phoneNum !== null &&
			   myBdate !== null)
            {
                if (userName.value.length > 0 && passWord.value.length > 0)
                {
                    api.post('createAccountPost',
                        {
                            userInfo: {
                                username: userName.value,
                                password: passWord.value,
                                fName: firstName.value,
                                lName: lastName.value,
                                email: emailAddr.value,
                                phone: phoneNum.value,
                                bdate: myBdate.value
                            }
                        })
                        .then(res =>
                        {
                            window.location.href = ((res !== null && res.data) ? "/login" : "/createaccount");
                        })
                        .catch((err: Error) =>
                        {
                            return Promise.reject(err);
                        });
                }
            }
	    }
    }
	
    render(): JSX.Element
    {
	    return (
	        <Fragment>
                <AccountSettings.SECTION>
                    <AccountSettings.ACCOUNT_LIST>
                        <AccountSettings.UL_HORIZ_LIST><AccountSettings.UL_HORIZ_LIST_LI>Create Account</AccountSettings.UL_HORIZ_LIST_LI></AccountSettings.UL_HORIZ_LIST>
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
                            <AccountSettings.LABEL>Birth Date:</AccountSettings.LABEL>
                            <AccountSettings.INPUT type="date" name="myDate" id="myDate"/><br/>
                            <AccountSettings.INPUT_LAST_OF_TYPE id="mySubmit" type="Submit" onClick={this.createAccount} value="Submit"/>
                        </AccountSettings.FORM_DIV>
                    </AccountSettings.ACCOUNT_LIST>
                </AccountSettings.SECTION>
            </Fragment>
	    );
    }
}
export { CreateAccountComponent };
