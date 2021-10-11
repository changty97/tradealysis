import { Component, Fragment } from "react";
import { Login } from "../cssComponents/Login";

import axios from "axios";
const api = axios.create({
    baseURL: 'http://localhost:3001/'
});


class LoginComponent extends Component<any, any>
{
	public loginState : boolean;
	
	constructor(props: any)
	{
	    super(props);
	    this.loginState = true;
	    this.login = this.login.bind(this);
	}
	
	public getLoginState():boolean
	{
	    return this.loginState;
	}

	private login(): void
	{
	    if (document != null)
	    {
	        const str1 = document.getElementById(`uname`);
	        const str2 = document.getElementById(`pssd`);
	        if (str1 != null && str2 != null)
	        {
	            const str1Value = (str1 as HTMLInputElement).value;
	            const str2Value = (str2 as HTMLInputElement).value;
	            api.get('testGetDb', {
	                params: {
	                    username: `${str1Value}`,
	                    password: `${str2Value}`
	                }
	            }).then(res =>
	            {
	                const myNum = Number(res.data);
	                alert(myNum);

	                if (myNum === 1)
	                {
	                    this.loginState = true;
	                    alert("Login");
	                }
	                else
	                {
	                    alert("Not Login");
	                }
	            });
	        }
	    }
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
	                                id="uname"
	                                type="text"
	                                placeholder=""
	                            />
	                            <Login.USERNAME_AND_PASSWORD_TXT_BOXE_LABELS>Password</Login.USERNAME_AND_PASSWORD_TXT_BOXE_LABELS>
	                            <Login.USERNAME_OR_PSWD_INPUT
	                                id="pssd"
	                                type="password"
	                                placeholder=""
	                            />
	                        </Login.USERNAME_AND_PASSWORD_TXT_BOXES>
						   <Login.LOGIN_BUTTON>
	                        <Login.FORGOT_PSSD_BUTTON type="submit" onClick={this.login}>Login</Login.FORGOT_PSSD_BUTTON>
	                            <Login.FORGOT_PSSD_BUTTON>Forgot Password ?</Login.FORGOT_PSSD_BUTTON>
	                            <Login.FORGOT_PSSD_BUTTON>Sign Up</Login.FORGOT_PSSD_BUTTON>
	                        </Login.LOGIN_BUTTON>
	                </Login.LOGIN_BOX>
	            </Login.SECTION>
	        </Fragment>
	    );
	}
}
export { LoginComponent };
