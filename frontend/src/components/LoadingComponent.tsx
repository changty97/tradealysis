import React, { Component } from "react";
import { Loading } from "../cssComponents/Loading";
import LoadingAnimation from "../images/trend_loading.svg";

class LoadingComponent extends Component {
    render(): JSX.Element {
        return (
            <React.Fragment>
                <Loading.ANIMATION type="image/svg+xml" data={LoadingAnimation} />
                <Loading.OVERLAY />
                <Loading.MESSAGE>Loading...</Loading.MESSAGE>
            </React.Fragment>
        );
    }
}

export { LoadingComponent }