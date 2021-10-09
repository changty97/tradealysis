import { Component, Fragment } from "react";
import { IReportsProps } from "../models/IReportsProps";
import { IReportsState } from "../models/IReportsState";
import { Support } from "../cssComponents/Support";

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
            </Fragment>
        );
    }
}
export { SupportComponent };
