import { Component } from "react";
import sty from "styled-components";

class Overview extends Component
{
    public static readonly DATE_RANGE = sty.button `
        text-decoration: none;
		font-size: 1.2vw;
		background-color: #e7e7e7;
		border: none;
		color: black;
		padding: 15px 32px;
		text-align: center;
		text-decoration: none;
		display: inline-block;
		margin: 4px 2px;
		cursor: pointer;
		border-radius: 2px;
		&:hover {
			background-image: linear-gradient(rgba(0, 0, 0, 0.4) 0 0);
		} 
        font-weight: bold;
        fond-size: 26px;
    `;

    public static readonly SECTION = sty.section ` 
		height: 70vh;
		margin: 0.5% 2%;
        overflow-y: auto;
	`;

	public static readonly LEFT = sty.div `
        float: left;
        width: 80%;
	`;

    public static readonly RIGHT = sty.div `
        float: left;
        width: 20%;
	`;

    public static readonly CAPTION = sty.caption `
        font-weight: bold;
        font-size: 16px;
	`;

    public static readonly SUMMARY = sty.table `
        table-layout: fixed;
        text-align: center;
        font-size: 26px;
        width: 100%;
	`;

    public static readonly TD_COLORED = sty.td<{ value: number }> `
        color: ${props =>
    {
        if (props.value > 0)
        {
            return "green";
        }
        else if (props.value < 0)
        {
            return "red";
        }
        else
        {
            return "black";
        }
    }};
    `;

    public static readonly TABLE = sty.table `
        font-size: 16px;
        padding: 15px;
	`;

    public static readonly THEAD = sty.thead `
        font-size: 16px;
	`;

    public static readonly TBODY = sty.tbody `
	`;

    public static readonly TR = sty.tr `
	`;

    public static readonly TH = sty.th `
        padding-right: 10px;
        padding-bottom: 10px;
	`;

    public static readonly TD = sty.td `
        padding-right: 10px;
        padding-bottom: 5px;
	`;
	
	public static readonly ROW = sty.div `
        display: flex;
	`;
	
    public static readonly LINE_CHART = sty.div `
        width: 80%;
	`;
	
    public static readonly PIE_CHART = sty.div `
        align-items: center;
        display: flex;
        width: 20%;
	`;

    public static readonly BAR_CHART = sty.div `
        display: flex;
	`;
}
export { Overview };
