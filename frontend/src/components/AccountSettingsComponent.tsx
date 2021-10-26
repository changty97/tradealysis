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
	        uname: "User",
            pssd: "",
            fName: "",
            lName: "",
            email: "",
            phone: "",
            date: ""
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
        api.get('accountunameFromKeyGET', {
	        params: {
	            key: `${theKey}`,
	            }
	        }
	    )
	    .then((res) =>
	    {
		    api.get('accountfNameFromKeyGET', {
				params: {
					key: `${theKey}`,
					}
				}
			)
			.then((res2)=>
			{
				api.get('accountlNameFromKeyGET', {
					params: {
						key: `${theKey}`,
						}
					}
				)
				.then((res3)=>
				{
					api.get('accountemailFromKeyGET', {
						params: {
							key: `${theKey}`,
							}
						}
					)
					.then((res4)=>
					{
						api.get('accountphoneFromKeyGET', {
							params: {
								key: `${theKey}`,
								}
							}
						)
						.then((res5)=>
						{
							api.get('accountbdateFromKeyGET', {
								params: {
									key: `${theKey}`,
									}
								}
							)
							.then((res6) =>
							{
								console.log("test");
								this.initalizeTextFields();
								this.setState({
									uname: res.data,
									pssd: "",
									fName: res2.data,
									lName: res3.data,
									email: res4.data,
									phone: res5.data,
									date: res6.data
								});
								this.initalizeTextFields();
							});
						});
					});
					
					
				});
			});
	    })
		.catch((err: Error) =>
        {
            return Promise.reject(err);
        }); 

    }
	
	private initalizeTextFields(): void {
		if(document !== null) {
			const userName  = (document.getElementById(`myUsername`) as HTMLInputElement);
			const theFName  = (document.getElementById(`myFName`) as HTMLInputElement);
			const theLName  = (document.getElementById(`myLName`) as HTMLInputElement);
			const theEmail = (document.getElementById(`myEmail`) as HTMLInputElement);
			const thePhone = (document.getElementById(`myPhone`) as HTMLInputElement);
			const theBdate = (document.getElementById(`myDate`) as HTMLInputElement);
			
			if(userName !== null && theFName !== null && theLName !== null && 
			   theEmail !== null && thePhone !== null && theBdate !== null) 
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
