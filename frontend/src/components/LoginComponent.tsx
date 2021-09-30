import { Component, Fragment } from "react";
import { All } from "../cssComponents/All";
import { NavBarLoginComponent } from "./NavBarLoginComponent";
import { Login } from "../cssComponents/Login";
import { FooterLoginComponent } from "./FooterLoginComponent";

class LoginComponent extends Component
{
    render(): JSX.Element
    {
        return (
            <Fragment>
                <All.HTML><style>{'body { background-color: rgb(170,170,170); }'}</style>
                    <All.HTML_BODY>
                        <NavBarLoginComponent />
                        <Login.SECTION>
                            <Login.LOGIN_BOX>
                                <Login.USERNAME_AND_PASSWORD_TXT_BOXES>
                                    <Login.USERNAME_OR_PSWD_INPUT type="text" placeholder="Username" />
                                    <Login.USERNAME_OR_PSWD_INPUT type="text" placeholder="Password" />
                                </Login.USERNAME_AND_PASSWORD_TXT_BOXES>
                                <Login.LOGIN_BUTTON>
                                    <Login.FORGOT_PSSD_BUTTON>Login</Login.FORGOT_PSSD_BUTTON>
                                    <Login.FORGOT_PSSD_BUTTON>Forgot Password?</Login.FORGOT_PSSD_BUTTON>
                                    <Login.FORGOT_PSSD_BUTTON>Sign Up</Login.FORGOT_PSSD_BUTTON>
                                </Login.LOGIN_BUTTON>
                            </Login.LOGIN_BOX>
                        </Login.SECTION>
                        <FooterLoginComponent/>
                    </All.HTML_BODY>
                </All.HTML>
            </Fragment>
        );
    }
}
export { LoginComponent };
