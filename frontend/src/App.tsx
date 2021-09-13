import { Component } from "react";
import { ReportsComponent } from "./components/ReportsComponent";
import { StrategiesComponent } from "./components/StrategiesComponent";
import { Overview } from "./components/Overview";
import { IAppState } from "./models/IAppState";
import { BrowserRouter, Route, Switch } from 'react-router-dom';

class App extends Component<any, IAppState>
{
    constructor(props: any)
    {
        super(props);

        this.state = {
            totalRequestsMade: 0
        };

        this.incrementTotalRequestsMade = this.incrementTotalRequestsMade.bind(this);
    }

    incrementTotalRequestsMade(): void
    {
        this.setState({
            totalRequestsMade: this.state.totalRequestsMade + 1
        });
    }

    render(): JSX.Element
    {
        return (
            <div>
                TODO: Everything
                <BrowserRouter>
                    <Switch>
                        <Route path="/report">
                            <ReportsComponent/>
                        </Route>
                        <Route path="/strategies">
                            <StrategiesComponent/>
                        </Route>
                        <Route path="/report/overview">
                            <Overview></Overview>
                        </Route>
                    </Switch>
                </BrowserRouter>
            </div>
        );
    }
}

export { App };
