import { Component } from "react";
import { ReportsComponent } from "./components/ReportsComponent";
import { StrategiesComponent } from "./components/StrategiesComponent";
import { HomeComponent } from "./components/HomeComponent";
import { Overview } from "./components/Overview";
import { SupportComponent } from "./components/SupportComponent";
import { AboutComponent } from "./components/AboutComponent";
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
                <BrowserRouter>
                    <Switch>
                        <Route path="/report">
                            <ReportsComponent/>
                        </Route>
                        <Route path="/strategies">
                            <StrategiesComponent/>
                        </Route>
                        <Route path="/overview">
                            <Overview/>
                        </Route>
                        <Route path="/support">
                            <SupportComponent/>
                        </Route>
                        <Route path="/about">
                            <AboutComponent/>
                        </Route>
						
                        <Route path="/">
                            <HomeComponent/>
                        </Route>
                    </Switch>
                </BrowserRouter>
            </div>
        );
    }
}

export { App };
