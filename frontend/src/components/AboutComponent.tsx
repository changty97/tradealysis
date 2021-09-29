import { Component, Fragment } from "react";
import { All } from "../cssComponents/All";
import { NavBarComponent } from "./NavBarComponent";
import { About } from "../cssComponents/About";
import { FooterComponent } from "./FooterComponent";
import AboutImg from "../images/about.jpg";

class AboutComponent extends Component
{
    render(): JSX.Element
    {
        return (
            <Fragment>
                <All.HTML><style>{'body { background-color: rgb(170,170,170); }'}</style>
                    <All.HTML_BODY>
                        <NavBarComponent />
                        <About.SECTION>
                            <About.LEFTHOME>
                                <About.LEFTHOME_H1>Welcome to Tradealysis</About.LEFTHOME_H1>
                                <div id="showmedia">
                                    <About.LEFTHOME_DIV_IMG src={AboutImg} width="440" height="265" alt="guide"/>
                                </div>
                            </About.LEFTHOME>
                            <About.ABOUT_RIGHT_HOME>
                                <h1>*About this website</h1>
                                <h1>*Who may benefit from using this website</h1>
                                <h1>*How to contact us</h1>
                            </About.ABOUT_RIGHT_HOME>
                        </About.SECTION>
                        <FooterComponent />
                    </All.HTML_BODY>
                </All.HTML>
            </Fragment>
        );
    }
}
export { AboutComponent };
