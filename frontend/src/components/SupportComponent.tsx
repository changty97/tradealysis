import { Component, Fragment } from "react";
import { IReportsProps } from "../models/IReportsProps";
import { IReportsState } from "../models/IReportsState";
// import { Link } from "react-router-dom";
import { NavBarComponent } from "./NavBarComponent";
import { FooterComponent } from "./FooterComponent";



class SupportComponent extends Component<IReportsProps, IReportsState>
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
                        <header id="allHeader">
                            <NavBarComponent/>
                        </header>
                        <section>
                            <div id="sectionDiv">
							  <form>
                                    <div id="header">
                                        <ul id="horizontal-list">
                                            <li>Support</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <label>Please Enter Question:</label>
                                    </div>
                                    <div>
                                        <textarea id="support" name="support"></textarea>
                                    </div>
                                    <div>
                                        <input type="submit" value="Submit"/>
                                    </div>
							  </form>
							 </div>
                        </section>
                    </body>
                    <footer>
                        <FooterComponent />
                    </footer>
                </html>
            </Fragment>
        );
    }
}
export { SupportComponent };
