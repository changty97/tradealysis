import { Component, Fragment } from "react";
import { IReportsProps } from "../models/IReportsProps";
import { IReportsState } from "../models/IReportsState";
import { NavBarComponent } from "./NavBarComponent";
import { FooterComponent1 } from "./FooterComponent1";
import AboutImg from "../images/about.jpg";

class AboutComponent extends Component<IReportsProps, IReportsState>
{
    constructor(props: IReportsProps)
    {
        super(props);
        this.state = {
            url: ""
        };
    }
	
    render(): JSX.Element
    {
        return (
            <Fragment>
                <html>
                    <body>
                        <header id="allHeader"><NavBarComponent/></header>
                        <section>
                            <div className="leftHome">
                                <h1>Welcome to Tradealysis</h1>
                                <div id="showmedia">
                                    <img src={AboutImg} width="440" height="265" alt="image guide"/>
                                </div>
                            </div>
                            <div className="about-rightHome">
                                <h1>*About this website</h1>
                                <h1>*Who may benefit from using this website</h1>
                                <h1>*How to contact us</h1>
                            </div>
                        </section>
                       <footer>
                            <FooterComponent1/>
                        </footer>
                    </body>
                </html>
            </Fragment>
        );
    }
}
export { AboutComponent };
