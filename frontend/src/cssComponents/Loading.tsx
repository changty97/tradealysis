import { Component } from "react";
import sty from "styled-components";

class Loading extends Component {
    public static readonly ANIMATION = sty.object `		
        z-index: 50000;
        position: absolute;
        top: 50%;
        left: 50%;
        width: 300px;
        transform: translate(-20%, -50%);
	`;

    public static readonly OVERLAY = sty.div `
        z-index: 49999; 
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: rgba(0, 0, 0, 0.5);  
        transition: opacity 2s linear;
    `;

    public static readonly MESSAGE = sty.div `
        z-index: 50000;
        position: absolute;
        top: 65%;
        left: 50%;
        text-align: center;
        font-size: 26px;
        width: 100%;
        transform: translate(-50%, -50%);
    `;
}

export { Loading }