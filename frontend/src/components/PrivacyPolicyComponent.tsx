import { Component, Fragment } from "react";
import { NavBarComponent } from "./NavBarComponent";
import { FooterComponent } from "./FooterComponent";

class PrivacyPolicyComponent extends Component
{
    render(): JSX.Element
    {
        return (
            <Fragment>
                <NavBarComponent/>
                <section>
                    <ul id="horizontal-list"><li><a href="">Privacy</a></li></ul>
                    <div className="leftHome"><h1>Privacy Policy</h1></div>
                </section>
                <FooterComponent/>
            </Fragment>
        );
    }
}
export { PrivacyPolicyComponent };
