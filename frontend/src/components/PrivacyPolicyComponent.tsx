import { Component, Fragment } from "react";
import { All } from "../cssComponents/All";
import { NavBarComponent } from "./NavBarComponent";
import { Privacy } from "../cssComponents/Privacy";
import { FooterComponent } from "./FooterComponent";

class PrivacyPolicyComponent extends Component
{
    render(): JSX.Element
    {
        return (
            <Fragment>
                <All.HTML><style>{'body { background-color: rgb(170,170,170); }'}</style>
                    <All.HTML_BODY>
                        <NavBarComponent/>
                        <Privacy.SECTION>
                            <Privacy.LEFTHOME><h1>Privacy Policy</h1></Privacy.LEFTHOME>
                        </Privacy.SECTION>
                        <FooterComponent/>
                    </All.HTML_BODY>
                </All.HTML>
            </Fragment>
        );
    }
}
export { PrivacyPolicyComponent };
