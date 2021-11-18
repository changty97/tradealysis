import { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import { Landing } from "../cssComponents/Landing";

class LandingComponent extends Component
{
    render(): JSX.Element
    {
        return (
            <Fragment>
                <Landing.SECTION>
                    <Landing.H1>Welcome to Tradealysis!</Landing.H1>
                    <p>Track Personal Stocks on another Level</p>
                    <Landing.BAR_GRID>
                        <Landing.BAR_GRAPH_1></Landing.BAR_GRAPH_1>
                        <Landing.BAR_GRAPH_2></Landing.BAR_GRAPH_2>
                        <Landing.BAR_GRAPH_3></Landing.BAR_GRAPH_3>
                        <Landing.BAR_GRAPH_4></Landing.BAR_GRAPH_4>
                    </Landing.BAR_GRID>
                    <Link to="/createaccount" style={{
                        color: "white"
                    }}><Landing.A>Sign Up</Landing.A></Link>
                </Landing.SECTION>
                
            </Fragment>
        );
    }
}
export { LandingComponent };
