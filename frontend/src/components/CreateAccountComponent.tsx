import { Component, Fragment } from "react";
import { AccountSettings } from "../cssComponents/AccountSettings";
import { api, FE_KEY } from "../constants/globals";
import Swal from 'sweetalert2';


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
        if (document)
	    {
            const userName  = (document.getElementById(`myUsername`) as HTMLInputElement);
	        const passWord  = (document.getElementById(`myPassword`) as HTMLInputElement);
            const firstName = (document.getElementById(`myFName`) as HTMLInputElement);
            const lastName  = (document.getElementById(`myLName`) as HTMLInputElement);
            const emailAddr = (document.getElementById(`myEmail`) as HTMLInputElement);
            const phoneNum  = (document.getElementById(`myPhone`) as HTMLInputElement);
            const myBdate   = (document.getElementById(`myDate`) as HTMLInputElement);
			
            if (userName && passWord && firstName && lastName && emailAddr && phoneNum && myBdate)
            {
                if (userName.value.length === 0 && passWord.value.length === 0)
                {
                    Swal.fire({
                        title: 'Specify a Username & Password',
                        icon: 'error',
                        timer: 1000,
                        showCancelButton: false,
                        showConfirmButton: false
                    });
                }
                else if (userName.value.length === 0 || passWord.value.length === 0)
                {
                    Swal.fire({
                        title: (userName.value.length === 0) ? 'Input a Username' : 'Input a Password',
                        icon: 'error',
                        timer: 1000,
                        showCancelButton: false,
                        showConfirmButton: false
                    });
                }
                else if (userName.value.length > 0 && passWord.value.length > 0)
                {
                    api.post('createAccountPost',
                        {
                            userInfo: {
                                FE_KEY: FE_KEY,
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
                            if (res)
                            {
                                if (res.data)
                                {
                                    Swal.fire({
									  icon: 'success',
									  title: 'Account Created. Sign In!',
									  showConfirmButton: false,
									  timer: 750
                                    }).then(() =>
                                    {
                                        window.location.href = "/login";
                                        return;
                                    });
                                }
                                else
                                {
                                    Swal.fire({
                                        title: 'Account Already Exists with this Username',
                                        icon: 'error',
                                        timer: 1300,
                                        showCancelButton: false,
                                        showConfirmButton: false
                                    })
                                        .then(() =>
                                        {
                                            window.location.href = "/createaccount";
                                        });
                                }
                            }
							
                        }).catch((err: Error) =>
                        {
                            console.log(err);
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
                    <AccountSettings.SECTION_INNER>
                        <div><AccountSettings.AS_LABEL>Create New Account</AccountSettings.AS_LABEL><hr/></div>
                        <AccountSettings.FORM_DIV>
                            <AccountSettings.FORM_DIV_ITEM1>
                                <AccountSettings.LABEL>Username *</AccountSettings.LABEL>
                                <AccountSettings.LABEL>Password *</AccountSettings.LABEL>
                                <AccountSettings.LABEL>First Name</AccountSettings.LABEL>
                                <AccountSettings.LABEL>Last Name</AccountSettings.LABEL>
                                <AccountSettings.LABEL>E-mail</AccountSettings.LABEL>
                                <AccountSettings.LABEL>Phone</AccountSettings.LABEL>
                                <AccountSettings.LABEL>Birth Date</AccountSettings.LABEL>
                            </AccountSettings.FORM_DIV_ITEM1>
                            <AccountSettings.FORM_DIV_ITEM1>
                                <AccountSettings.INPUT type="text" name="myUsername" id="myUsername" />
                                <AccountSettings.INPUT type="password" name="myPassword" id="myPassword"/>
                                <AccountSettings.INPUT type="text" name="myFName" id="myFName"/>
                                <AccountSettings.INPUT type="text" name="myLName" id="myLName"/>
                                <AccountSettings.INPUT type="email" name="myEmail" id="myEmail" />
                                <AccountSettings.INPUT type="tel" name="Phone" id="myPhone"/>
                                <AccountSettings.INPUT type="date" name="myDate" id="myDate"/>
                            </AccountSettings.FORM_DIV_ITEM1>
                        </AccountSettings.FORM_DIV>
                        <div> <AccountSettings.SUBMIT_BUTTON id="mySubmit" type="Submit" onClick={this.createAccount} value="Submit"/> </div>
                    </AccountSettings.SECTION_INNER>
                </AccountSettings.SECTION>
            </Fragment>
        );
    }
}
export { CreateAccountComponent };
