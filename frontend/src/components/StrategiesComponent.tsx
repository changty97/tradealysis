import { Component, Fragment } from "react";
import { IStrategiesProps } from "../models/IStrategiesProps";
import { IStrategiesState } from "../models/IStrategiesState";
import { NavBarComponent } from "../components/NavBarComponent";
import { Link } from "react-router-dom";
import "../styles/strategies.module.css";
class StrategiesComponent extends Component<IStrategiesProps, IStrategiesState>
{
    constructor(props: IStrategiesProps)
    {
        super(props);

        this.state = {
            showPatternForm: false,
        };
        this.createPattern = this.createPattern.bind(this);
    }

    createPattern(): void
    {
        this.setState({
            showPatternForm: true,
        });
    }

    render(): JSX.Element
    {
        
        const patternForm = (
            <div>
                <h1>Enter Strategy Criteria</h1>
                <form>
                    <label>DOI</label>
                    <input type="text" id="doi" value={
                        (new Date()).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit"
                        })
                    }></input>
                </form>
            </div>

            
        );
        return (
            <Fragment>
                <NavBarComponent/>
                <Link to="/report"><button>Trade Report</button></Link>
                <Link to="/overview"><button>Overview</button></Link>
                <Link to="/strategies"><button>Strategies</button></Link>
                <button style={ {
                    float: 'right'
                }} onClick = {this.createPattern}>New Pattern</button>
                {this.state.showPatternForm ? patternForm : null }
            </Fragment>
        );
    }
}
export { StrategiesComponent };
