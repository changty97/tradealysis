import { Component, Fragment } from "react";
import { IReportsProps } from "../models/IReportsProps";
import { IReportsState } from "../models/IReportsState";
import { SheetComponent } from "../components/SheetComponent";
import { Link } from "react-router-dom";
import { Reports } from "../cssComponents/Reports";

/**
	Reports Component
**/
class ReportsComponent extends Component<IReportsProps, IReportsState>
{
    constructor(props: IReportsProps)
    {
        super(props);
        this.state = {
            reportsId: null,
        };
    }
    componentDidMount(): void
    {
        const val = localStorage.getItem('reportsId');
	    if (!val)
        {
            window.location.href = "/";
        }
        this.setState({
            reportsId: val
        });
    }
	
    render(): JSX.Element | null
    {
        return (
            <Fragment>
                <Reports.SECTION>
                    <Link to="/report"><Reports.BUTTON>Trade Report</Reports.BUTTON></Link>
                    <Link to="/overview"><Reports.BUTTON>Overview</Reports.BUTTON></Link>
                    <SheetComponent />
                </Reports.SECTION>
            </Fragment>
        );
    }
}
export { ReportsComponent };
