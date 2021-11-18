import { Component, Fragment } from "react";
import { Support } from "../cssComponents/Support";

class SupportComponent extends Component
{
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
                                <Support.INPUT_SUMBIT type="submit" value="Submit"/>
                            </div>
                        </Support.FORM>
                    </Support.SECTION_DIV>
                </Support.SECTION>
            </Fragment>
        );
    }
}
export { SupportComponent };
