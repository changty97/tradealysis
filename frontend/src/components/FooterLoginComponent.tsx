import { Component, Fragment } from "react";

class FooterLoginComponent extends Component
{
    render(): JSX.Element
    {
        return (
            <Fragment>
                <footer>
                    <div>
                        <ul>
                            <li><a href="/support">Support</a></li>
                            <li><a href="/about">About</a></li>
                            <li><a href="./privacy">Privacy Policy</a></li>
                        </ul>
                    </div>
                </footer>
            </Fragment>
        );
    }
}
export { FooterLoginComponent };
