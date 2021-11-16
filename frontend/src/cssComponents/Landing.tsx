import { Component } from "react";
import sty from "styled-components";

class Landing extends Component
{
	public static readonly SECTION = sty.section `
                width: 100%;
                padding:60px 0;
                text-align: center;
                background: #587e7e;
                color: white;
	`;
        public static readonly H1 = sty.h1 `
                font-size: 35px;
	`;
	public static readonly A = sty.a `
                font-size: 20px;
                display: inline-block;
                border: 1px solid white;
                padding: 10px 20px;
                border-radius: 10px;
                cursor: pointer;
                font-weight: 300;
                margin-top: 30px;
                &:hover {
                background-color: white;
                color: #587e7e;
                } 
	`;
        public static readonly BAR_GRID = sty.div `
                margin: auto;
                padding: 10px;
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                grid-template-rows: repeat(100, 1fr);
                grid-column-gap: 5px;
                height: 200px;
                width: 150px;
                padding: 5px 10px;
	`;
        public static readonly BAR_GRAPH_1 = sty.div `
                border-radius: 5px 5px 0 0;
                transition: all .6s ease;
                background-color: #6c6a6a;
                grid-row-start: 1;
                grid-row-end: 101;
	`;
        public static readonly BAR_GRAPH_2 = sty.div `
                border-radius: 5px 5px 0 0;
                transition: all .6s ease;
                background-color: #bbbbbb;
                grid-row-start: 150;
                grid-row-end: 80;
	`;
        public static readonly BAR_GRAPH_3 = sty.div `
                border-radius: 5px 5px 0 0;
                transition: all .6s ease;
                background-color: #404040;
                grid-row-start: 150;
                grid-row-end: 35;
	`;
        public static readonly BAR_GRAPH_4 = sty.div `
                border-radius: 5px 5px 0 0;
                transition: all .6s ease;
                background-color: #dddddd;
                grid-row-start: 150;
                grid-row-end: 50;
	`;
}
export { Landing };
