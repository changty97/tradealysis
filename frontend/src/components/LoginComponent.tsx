import { Component, Fragment } from "react";
import { Login } from "../cssComponents/Login";
import axios from "axios";

const api = axios.create({
    baseURL: 'https://api.tradealysis.cf/'
});

class LoginComponent extends Component<any, any>
{
    constructor(props: any)
    {
	    super(props);
        this.loginKey = this.loginKey.bind(this);
        this.signupKey = this.signupKey.bind(this);
    }

    private setLocalStorageStateKey(theKey:string) : void
    {
        localStorage.setItem("Key", theKey);
    }

    private loginKey(): void
    {
        if (document != null)
	    {
	        const str1 = document.getElementById(`username`);
	        const str2 = document.getElementById(`password`);
	        if (str1 != null && str2 != null)
	        {
	            const str1Value = (str1 as HTMLInputElement).value;
	            const str2Value = (str2 as HTMLInputElement).value;
	            api.get('loginKeyGET', {
	                params: {
	                    username: `${str1Value}`,
	                    password: `${str2Value}`
	                }
	            })
                    .then(res =>
	            {
                        if (res != null)
                        {
                            const val = res.data;
                            if (val !== "")
                            {
                                this.setLocalStorageStateKey(val);
                                window.location.reload();
                            }
                            else
                            {
                                this.setLocalStorageStateKey("");
                            }
                        }
	            })
                    .catch((err: Error) =>
                    {
                        return Promise.reject(err);
                    })
                    .finally(() =>
                    {
                        (str1 as HTMLInputElement).value = '';
                        (str2 as HTMLInputElement).value = '';
                    });
	        }
	    }
    }

    private signupKey(): void
    {
        window.location.href = "/createaccount";
    }
    render(): JSX.Element
    {
	    return (
	        <Fragment>
	            <Login.SECTION>
	                <Login.LOGIN_BOX>
	                    <Login.LOGIN_LABEL_DIV>
	                        <label>Login</label>
	                    </Login.LOGIN_LABEL_DIV>
	                        <Login.USERNAME_AND_PASSWORD_TXT_BOXES>
	                            <Login.USERNAME_AND_PASSWORD_TXT_BOXE_LABELS>Username</Login.USERNAME_AND_PASSWORD_TXT_BOXE_LABELS>
	                            <Login.USERNAME_OR_PSWD_INPUT
                                name="username"
	                                id="username"
	                                type="text"
	                                placeholder=""
	                            />
	                            <Login.USERNAME_AND_PASSWORD_TXT_BOXE_LABELS>Password</Login.USERNAME_AND_PASSWORD_TXT_BOXE_LABELS>
	                            <Login.USERNAME_OR_PSWD_INPUT
	                                name="password"
                                id="password"
	                                type="password"
	                                placeholder=""
	                            />
	                        </Login.USERNAME_AND_PASSWORD_TXT_BOXES>
						   <Login.LOGIN_BUTTON>
	                        <Login.FORGOT_PSSD_BUTTON type="submit" onClick={this.loginKey}>Login</Login.FORGOT_PSSD_BUTTON>
	                            <Login.FORGOT_PSSD_BUTTON>Forgot Password ?</Login.FORGOT_PSSD_BUTTON>
	                            <Login.FORGOT_PSSD_BUTTON type="submit" onClick={this.signupKey}>Sign Up</Login.FORGOT_PSSD_BUTTON>
	                        </Login.LOGIN_BUTTON>
	                </Login.LOGIN_BOX>
	            </Login.SECTION>
	        </Fragment>
	    );
    }
}
export { LoginComponent };
