import { Component, Fragment } from "react";
import { Login } from "../cssComponents/Login";
import { api/**, FE_KEY**/ } from "../constants/globals";

class LoginComponent extends Component<any, any>
{
    constructor(props: any)
    {
	    super(props);
        this.loginKey = this.loginKey.bind(this);
        this.signupKey = this.signupKey.bind(this);
        this.forgotPssd = this.forgotPssd.bind(this);
    }

    private setLocalStorageStateKey(theKey:string) : void
    {
        localStorage.setItem("Key", theKey);
    }
	
    private loginKey(): void
    {
        if (document)
	    {
	        const str1 = document.getElementById(`username`);
            const str2 = document.getElementById(`password`);
            let redirect = false;
	        if (str1 && str2)
	        {
	            const str1Value = (str1 as HTMLInputElement).value;
	            const str2Value = (str2 as HTMLInputElement).value;
	      
                api.post('loginKeyPOST', {
                    theData: {
                        username: `${str1Value}`,
                        password: `${str2Value}`
                    }
                })
                    .then(res => ((res.data as unknown) as string))
                    .then((val:string) =>
	            {
                        const invalidLoginLabel = document.getElementById('Invalid_Login_Mssg');
                        if (val && val !== "")
                        {
                            if (invalidLoginLabel)
                            {
                                invalidLoginLabel.innerHTML = "Logging In...";
                                invalidLoginLabel.style.color = "green";
                            }
                            this.setLocalStorageStateKey(val);
                            redirect = true;
                        }
                        else
                        {
                            this.setLocalStorageStateKey("");
                            if (invalidLoginLabel)
                            {
                                invalidLoginLabel.innerHTML = "Incorrect Username or Password";
                                invalidLoginLabel.style.color = "red";
                            }
                        }
	            })
                    .catch((err: Error) => console.error(`LoginComponent.loginKey(): ${  err}`))
                    .finally(() =>
                    {
                        (str1 as HTMLInputElement).value = '';
                        (str2 as HTMLInputElement).value = '';
                        if (redirect)
                        {
                            window.location.href = "/";
                        }
                    });
	        }
	    }
    }

    private signupKey(): void
    {
        window.location.href = "/createaccount";
    }
	
    private forgotPssd():void
    {
        window.location.href = "/support";
    }
	
    render(): JSX.Element
    {
	    return (
	        <Fragment>
	            <Login.SECTION>
	                <Login.LOGIN_BOX>
	                    <Login.LOGIN_LABEL_DIV>
	                        <Login.WELCOME_LABEL>Welcome</Login.WELCOME_LABEL>
	                    </Login.LOGIN_LABEL_DIV>
	                        <Login.USERNAME_AND_PASSWORD_TXT_BOXES>
	                            <Login.USERNAME_AND_PASSWORD_TXT_BOXE_LABELS>Username</Login.USERNAME_AND_PASSWORD_TXT_BOXE_LABELS>
	                            <Login.USERNAME_OR_PSWD_INPUT name="username" id="username" type="text" placeholder="" />
	                            <Login.USERNAME_AND_PASSWORD_TXT_BOXE_LABELS>Password</Login.USERNAME_AND_PASSWORD_TXT_BOXE_LABELS>
	                            <Login.USERNAME_OR_PSWD_INPUT name="password" id="password" type="password" placeholder="" />
	                        </Login.USERNAME_AND_PASSWORD_TXT_BOXES>
						   <Login.LOGIN_BUTTON>
	                        <Login.FORGOT_PSSD_BUTTON type="submit" onClick={this.loginKey}>Login</Login.FORGOT_PSSD_BUTTON>
	                            <Login.FORGOT_PSSD_BUTTON type="submit" onClick={this.forgotPssd}>Forgot Password?</Login.FORGOT_PSSD_BUTTON>
	                            <Login.FORGOT_PSSD_BUTTON type="submit" onClick={this.signupKey}>Sign Up</Login.FORGOT_PSSD_BUTTON>
                        </Login.LOGIN_BUTTON>
                        <Login.INVALID_LOGIN_MSSG id='Invalid_Login_Mssg'>Please Login</Login.INVALID_LOGIN_MSSG>
	                </Login.LOGIN_BOX>
	            </Login.SECTION>
	        </Fragment>
	    );
    }
}
export { LoginComponent };
