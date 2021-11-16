import { Component, Fragment } from "react";
import { About } from "../cssComponents/About";

class AboutComponent extends Component
{
    render(): JSX.Element
    {
        return (
            <Fragment>
                <About.SECTION>
                    <About.ABOUT_RIGHT_HOME>
                        <h1>*About this website</h1>
                        <h1>*Who may benefit from using this website</h1>
                        <h1>*How to contact us</h1>
                    </About.ABOUT_RIGHT_HOME>
                </About.SECTION>
            </Fragment>
        );
    }
}
export { AboutComponent };
