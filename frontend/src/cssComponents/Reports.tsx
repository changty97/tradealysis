import sty from "styled-components";
import { Component } from "react";

class Reports extends Component
{
	public static readonly SECTION = sty.section ` 
		height: 70vh;
		overflow: auto;
		margin: 2% 2%;
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
		&:hover {
			background-image: linear-gradient(rgba(0, 0, 0, 0.4) 0 0);
		}
	`;
	public static readonly SEARCH = sty.input ` 
		text-decoration: none;
		padding: 15px 32px;
		text-decoration: none;
		font-size: 16px;
		cursor: pointer;
	`;
}
export { Reports };
 
