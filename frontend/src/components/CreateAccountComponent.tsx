import { Component, Fragment } from "react";
import { AccountSettings } from "../cssComponents/AccountSettings";
import axios from "axios";

const api = axios.create({
    baseURL: 'http://localhost:3001/'
});


class CreateAccountComponent extends Component<any, any>
{
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
                    console.log("test");
                    api.get('loginKeyGET', {
                        params: {
                            username: ``,
                            password: ``
                        }
                    }).then(res =>
                    {
                        console.log("test");
                    })
                        .catch((err: Error) =>
                        {
                            return Promise.reject(err);
                        })
                        .finally(() =>
                        {
                            console.log("test");
                        });
					
                }
                else
                {
                    console.log("test");
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
                            <AccountSettings.LABEL>Birth Date</AccountSettings.LABEL>
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
