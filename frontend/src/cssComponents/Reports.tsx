import sty from "styled-components";
import { Component } from "react";

class Reports extends Component
{
	public static readonly SECTION = sty.section ` 
		height: 70vh;
		width: 100%;
		overflow: auto;
		margin: auto;
	`;
	public static readonly BUTTON = sty.button `
		text-decoration: none;
		font-size: 1.2vw;
		background-color: #e7e7e7;
		border: none;
		color: black;
		padding: 15px 32px;
		text-align: center;
		text-decoration: none;
		display: inline-block;
		font-size: 16px;
		margin: 4px 2px;
		cursor: pointer;
		border-radius: 2px;
	`;
	public static readonly SEARCH = sty.input ` 
		text-decoration: none;
		padding: 15px 32px;
		text-decoration: none;
		font-size: 16px;
		cursor: pointer;
		border-radius: 2px;
	`;
}
export { Reports };
 
