import { Component, Fragment } from "react";
import { Privacy } from "../cssComponents/Privacy";

class PrivacyPolicyComponent extends Component
{
    render(): JSX.Element
    {
        return (
            <Fragment>
                <Privacy.SECTION>
                    <Privacy.LEFTHOME><h1>Privacy Policy</h1></Privacy.LEFTHOME>
                </Privacy.SECTION>
            </Fragment>
        );
    }
}
export { PrivacyPolicyComponent };
