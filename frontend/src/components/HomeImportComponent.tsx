import { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import { All } from "../cssComponents/All";
import { NavBarComponent } from "./NavBarComponent";
import { Home } from "../cssComponents/Home";
import { Import } from "../cssComponents/Import";
import { FooterComponent } from "./FooterComponent";

class HomeImportComponent extends Component
{
    render(): JSX.Element
    {
        return (
            <Fragment>
                <All.HTML><style>{'body { background-color: rgb(170,170,170); }'}</style>
                    <All.HTML_BODY>
                        <NavBarComponent />
                        <Home.SECTION>
                            <Home.LEFT_HOME>
                                <Home.LEFT_HOME_MAIN_LIST_DIV_NOWRAP>
                                    <Home.LEFT_HOME_MAIN_LIST_PAGEON>
                                        <li>Home</li>
                                    </Home.LEFT_HOME_MAIN_LIST_PAGEON>
                                    <Home.LEFT_HOME_MAIN_LIST>
                                        <Link to="/input1"><Home.IMPORT_BUTTON>Import Broker Files</Home.IMPORT_BUTTON></Link>
                                    </Home.LEFT_HOME_MAIN_LIST>
                                </Home.LEFT_HOME_MAIN_LIST_DIV_NOWRAP>
                            </Home.LEFT_HOME>
							
                            <Home.RIGHT_HOME>
							
                                <div className="formBlock">
                                    <Import.FORM action="./home.html">
                                        <div className="INNER_FORM">
                                            <Import.FORM_TOP_DIV>
                                                <Import.FORM_TOP_DIV_LABEL>Select broker's file to import:</Import.FORM_TOP_DIV_LABEL>
                                                <Import.FORM_TOP_DIV_INPUT type="file" id="myfile" name="file_input"/>
                                            </Import.FORM_TOP_DIV>
                                            <Import.FORM_BOTTOM_DIV>
                                                <Import.FORM_BOTTOM_DIV_INPUT type="submit" id="myfile2"/>
                                            </Import.FORM_BOTTOM_DIV>
									
                                        </div>
                                    </Import.FORM>
                                </div>
							
							
							
							
							
							
							
							
							
							
							
							
							
							
							
							
							
							
							
							
                            </Home.RIGHT_HOME>
							
							
							
							
                        </Home.SECTION>
                        <FooterComponent/>
                    </All.HTML_BODY>
                </All.HTML>
            </Fragment>
        );
    }
}
export { HomeImportComponent };
