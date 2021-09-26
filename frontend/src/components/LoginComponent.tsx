import { Component, Fragment } from "react";
import { NavBarLoginComponent } from "./NavBarLoginComponent";
import { FooterLoginComponent } from "./FooterLoginComponent";

class LoginComponent extends Component
{
    render(): JSX.Element
    {
        return (
            <Fragment>
                <NavBarLoginComponent />
                <section className="account-section">
                    <div className="login-box">
                        <div className="inner-login-box">
                            <div className="usernamePasswordTextBoxes">
                                <input className="usernameOrPasswordInput" type="text" placeholder="Username" />
                                <input className="usernameOrPasswordInput" type="text" placeholder="Password" />
                            </div>
                            <div className="loginButtons">
                                <button className="forgotPsswdButton">Login</button>
                                <button className="forgotPsswdButton">Forgot Password?</button>
                                <button className="forgotPsswdButton">Sign Up</button>
                            </div>
                        </div>
                    </div>
                </section>
                <FooterLoginComponent/>
            </Fragment>
        );
    }
}
export { LoginComponent };
