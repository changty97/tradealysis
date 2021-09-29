import { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import { All } from "../cssComponents/All";
import { NavBarComponent } from "./NavBarComponent";
import { Reports } from "../cssComponents/Reports";
import { FooterComponent } from "./FooterComponent";

class StrategiesComponent extends Component
{
    render(): JSX.Element
    {
        return (
            <Fragment>
                <All.HTML><style>{'body { background-color: rgb(170,170,170); }'}</style>
                    <All.HTML_BODY>
                        <NavBarComponent />
                        <Reports.SECTION>
                            <Link to="/report"><button>Trade Report</button></Link>
                            <Link to="/overview"><button>Overview</button></Link>
                            <Link to="/strategies"><button>Strategies</button></Link>
                            <button style={ {
                                float: 'right'
                            }}>New Pattern</button>
                        </Reports.SECTION>
                        <FooterComponent />
                    </All.HTML_BODY>
                </All.HTML>
            </Fragment>
        );
    }
}
export { StrategiesComponent };
