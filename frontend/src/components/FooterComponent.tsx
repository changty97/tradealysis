import { Component, Fragment } from "react";

class FooterComponent extends Component
{	
    render(): JSX.Element
    {
        return (
            <Fragment>
                <div>
                    <ul>
                        <li><a href="./account1.html">Your Account</a></li>
                        <li><a href="/support">Support</a></li>
                        <li><a href="/about">About</a></li>
                        <li><a href="./privacy.html">Privacy Policy</a></li>
                    </ul>
                </div>
            </Fragment>
        );
    }
}
export { FooterComponent };
