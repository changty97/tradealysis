import { Component, Fragment } from "react";
import { IReportsProps } from "../models/IReportsProps";
import { IReportsState } from "../models/IReportsState";
// import { Link } from "react-router-dom";
import { All } from "../cssComponents/All";
import { NavBarComponent } from "./NavBarComponent";
import { Support } from "../cssComponents/Support";
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
                <All.HTML><style>{'body { background-color: rgb(170,170,170); }'}</style>
                    <All.HTML_BODY>
                        <NavBarComponent />
                        <Support.SECTION>
                            <Support.SECTION_DIV>
                                <Support.FORM>
                                    <div id="header">
                                        <Support.HORZ_LIST>
                                            <li>Support</li>
                                        </Support.HORZ_LIST>
                                    </div>
                                    <div>
                                        <label>Please Enter Question:</label>
                                    </div>
                                    <div>
                                        <Support.TEXTAREA id="support" name="support"></Support.TEXTAREA>
                                    </div>
                                    <div>
                                        <input type="submit" value="Submit"/>
                                    </div>
                                </Support.FORM>
                            </Support.SECTION_DIV>
                        </Support.SECTION>
                        <FooterComponent />
                    </All.HTML_BODY>
                </All.HTML>
            </Fragment>
        );
    }
}
export { SupportComponent };
