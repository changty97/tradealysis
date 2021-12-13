import { Component, Fragment } from "react";
import { AccountSettings } from "../cssComponents/AccountSettings";
import { IAccountSettingsState } from "../models/IAccountSettingsState";
import { api, FE_KEY } from "../constants/globals";
import Swal from 'sweetalert2';

/** Account Settings **/
class AccountSettingsComponent extends Component<any, IAccountSettingsState>
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
        this.getDataFromBackEnd = this.getDataFromBackEnd.bind(this);
        this.initalizeTextFields = this.initalizeTextFields.bind(this);
        this.updateSettings = this.updateSettings.bind(this);
    }
	
    componentDidMount(): void
    {
        this.getDataFromBackEnd();
    }
	
    private getDataFromBackEnd(): void
    {
        this.forceUpdate();
        const theKey = localStorage.getItem("Key");
	    if (!theKey)
	    {
	        this.logout();
	        return;
	    }
        api.get("accountData", {
	        params: {
                FE_KEY: FE_KEY,
	            key: `${theKey}`,
	            }
	        }
	    )
            .then((res) =>
            {
                api.get("usernameFromKeyGet", {
                    params: {
                        key: `${theKey}`,
                    }
                })
                    .then((res2) =>
                    {
                        const unameVal = res2.data;
                        const val = Object.values(res.data);
                        this.setState({
                            uname: unameVal,
                            fName: (val[0]) ? val[0] as string : "",
                            lName: (val[1]) ? val[1] as string : "",
                            email: (val[2]) ? val[2] as string : "",
                            phone: (val[3]) ? val[3] as string : "",
                            date: (val[4])  ? val[4] as string : ""
                        });
                        this.initalizeTextFields();
                    });
            });
    }

    private initalizeTextFields(): void
    {
        if (document)
        {
            const userName  = (document.getElementById(`myUsername`) as HTMLInputElement);
            const theFName  = (document.getElementById(`myFName`) as HTMLInputElement);
            const theLName  = (document.getElementById(`myLName`) as HTMLInputElement);
            const theEmail = (document.getElementById(`myEmail`) as HTMLInputElement);
            const thePhone = (document.getElementById(`myPhone`) as HTMLInputElement);
            const theBdate = (document.getElementById(`myDate`) as HTMLInputElement);
            if (userName && theFName && theLName && theEmail && thePhone && theBdate)
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


    private async updateSettings():Promise<void>
    {
        const userName  = (document.getElementById(`myUsername`) as HTMLInputElement);
	    const passWord  = (document.getElementById(`myOldPassword`) as HTMLInputElement);
        const newPassWord  = (document.getElementById(`myNewPassword`) as HTMLInputElement);
        const firstName = (document.getElementById(`myFName`) as HTMLInputElement);
        const lastName  = (document.getElementById(`myLName`) as HTMLInputElement);
        const emailAddr = (document.getElementById(`myEmail`) as HTMLInputElement);
        const phoneNum  = (document.getElementById(`myPhone`) as HTMLInputElement);
        const myBdate   = (document.getElementById(`myDate`) as HTMLInputElement);
		
        const theKey = localStorage.getItem("Key");
        
        if (theKey && userName && passWord && newPassWord && firstName && lastName && emailAddr && phoneNum && myBdate)
        {
            const wasUserNameUpdated = await this.updateUserName(theKey, userName.value);
            const wasPssdUpdated = await this.updatePssd(theKey, passWord.value, newPassWord.value);
            const wasAccountDataUpdate = await this.updateUserData(FE_KEY, theKey, firstName.value, lastName.value, emailAddr.value, phoneNum.value, myBdate.value);
            if (wasUserNameUpdated && wasPssdUpdated && wasAccountDataUpdate)
            {
                return Swal.fire({
				  icon: 'success',
				  title: 'Settings Updated!',
				  showConfirmButton: false,
				  timer: 1000
                }).then(() =>
                {
                    window.location.href = "/account";
                });
            }
        }
        return;
    }
	
    public async updateUserName(theKey: string|null, newUsername: string) : Promise<boolean>
    {
        return api.get('/usernameFromKeyGET', {
            params: {
                key: theKey
            }
        }).then((un) =>
        {
            if (un && un.data && un.data !== "" )
            {
                return api.get('/sameAccountGet', {
                    params: {
                        key: theKey,
                        account: newUsername,
                    }
                })
                    .then((unamesame) =>
                    {
                        if (unamesame)
                        {
                            if (unamesame.data)
                            {
                                return true;
                            }
                            else
                            {
                                return api.get('/accountExists', {
                                    params: {
                                        newAccountName: newUsername
                                    }
                                })
                                    .then((accountExists) =>
                                    {
                                        if (accountExists)
                                        {
                                            if (accountExists.data)
                                            {
                                                return Swal.fire({
                                                    title: "Sorry, Username already in Use",
                                                    icon: 'error',
                                                    timer: 1000,
                                                    showCancelButton: false,
                                                    showConfirmButton: false
                                                }).then(() =>
                                                {
                                                    return false;
                                                });
                                            }
                                            else
                                            {
                                                return api.get('/changeTheAccountName', {
                                                    params: {
                                                        key: theKey,
                                                        newAccountName: newUsername,
                                                    }
                                                }).then((created) =>
                                                {
                                                    if (created)
                                                    {
                                                        return true;
                                                    }
                                                    else
                                                    {
                                                        return Swal.fire({
                                                            title: "Sorry, Username already in Use",
                                                            icon: 'error',
                                                            timer: 1000,
                                                            showCancelButton: false,
                                                            showConfirmButton: false
                                                        }).then(() =>
                                                        {
                                                            return false;
                                                        });
                                                    }
                                                });
                                            }
                                        }
                                        return false;
                                    });
                            }
                        }
                        return false;
                    });
            }
            return false;
        });
    }
	
    public async updatePssd(theKey: string, oldPssd:string, newPssd:string):Promise<boolean>
    {
        if (oldPssd === newPssd && oldPssd === "")
        {
            return true;
        }
        else if (oldPssd === "" || newPssd === "")
        {
            return await Swal.fire({
                title: (oldPssd === "") ? 'What is Your Current Password?' : 'Whats Your New Password?',
                icon: 'error',
                timer: 1000,
                showCancelButton: false,
                showConfirmButton: false
            }).then(() =>
            {
                return false;
            });
        }
        else
        {
            return await api.get('/changePassword', {
                params: {
                    key: theKey,
                    oldP: oldPssd,
                    newP: newPssd,
                }
            })
                .then((changedPssd) =>
                {
                    if (!changedPssd.data)
                    {
                        Swal.fire({
                            title: 'Incorrect Password',
                            icon: 'error',
                            timer: 1000,
                            showCancelButton: false,
                            showConfirmButton: false
                        });
                        return false;
                    }
                    return true;
                });
        }
    }
	
    public async updateUserData(FE_KEY:string, theKey:string, theFirstName:string, theLastName: string, theEmail:string, thePhone:string, theBdate:string) : Promise<boolean>
    {
        return await api.get('/changeExtraAccountData', {
            params: {
                FE_KEY: FE_KEY,
                key: theKey,
                firstName: theFirstName,
                lastName: theLastName,
                email: theEmail,
                phone: thePhone,
                bdate: theBdate,
            }
        })
            .then((res)=>
            {
                if (!res.data)
                {
                    return Swal.fire({
                        title: 'Error Updating User Data',
                        icon: 'error',
                        timer: 1000,
                        showCancelButton: false,
                        showConfirmButton: false
                    })
                        .then(() =>
                        {
                            return false;
                        });
                }
                return true;
            });
    }
	
    render(): JSX.Element
    {
        return (
            <Fragment>
                <AccountSettings.SECTION>
                    <AccountSettings.SECTION_INNER>
                        <div>
                            <AccountSettings.AS_LABEL>Account Settings</AccountSettings.AS_LABEL>
                            <hr/>
                        </div>
                        <AccountSettings.FORM_DIV>
                            <AccountSettings.FORM_DIV_ITEM1>
                                <AccountSettings.LABEL>Username:</AccountSettings.LABEL>
                                <AccountSettings.LABEL>Old Password:</AccountSettings.LABEL>
                                <AccountSettings.LABEL>New Password:</AccountSettings.LABEL>
                                <AccountSettings.LABEL>First Name:</AccountSettings.LABEL>
                                <AccountSettings.LABEL>Last Name:</AccountSettings.LABEL>
                                <AccountSettings.LABEL>E-mail:</AccountSettings.LABEL>
                                <AccountSettings.LABEL>Phone:</AccountSettings.LABEL>
                                <AccountSettings.LABEL>Birth Date:</AccountSettings.LABEL>
                            </AccountSettings.FORM_DIV_ITEM1>
                            <AccountSettings.FORM_DIV_ITEM1>
                                <AccountSettings.INPUT type="text" name="myUsername" id="myUsername" />
                                <AccountSettings.INPUT type="password" name="myOldPassword" id="myOldPassword"/>
                                <AccountSettings.INPUT type="password" name="myNewPassword" id="myNewPassword"/>
                                <AccountSettings.INPUT type="text" name="myFName" id="myFName"/>
                                <AccountSettings.INPUT type="text" name="myLName" id="myLName"/>
                                <AccountSettings.INPUT type="email" name="myEmail" id="myEmail" />
                                <AccountSettings.INPUT type="tel" name="Phone" id="myPhone"/>
                                <AccountSettings.INPUT type="date" name="myDate" id="myDate"/>
                            </AccountSettings.FORM_DIV_ITEM1>
                        </AccountSettings.FORM_DIV>
                        <div>
                            <AccountSettings.SUBMIT_BUTTON id="mySubmit" type="Submit"  onClick = { this.updateSettings } value="Submit"/>
                        </div>
                    </AccountSettings.SECTION_INNER>
                </AccountSettings.SECTION>
            </Fragment>
        );
    }
}
export { AccountSettingsComponent };
