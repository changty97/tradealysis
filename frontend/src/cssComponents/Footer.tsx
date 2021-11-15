import { Component } from "react";
//import { Link } from "react-router-dom";
import sty from "styled-components";

class Footer extends Component
{
	public static readonly FOOTER = sty.footer `
		font: normal 15px Verdana, Arial, sans-serif;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #839a9b;
		position: absolute;
		width: 100%;
		text-align: center;
		bottom: 0;
	`;
	public static readonly FOOTER_DIV_UL = sty.ul `
		list-style-type: none;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		flex-wrap: wrap;
		padding: 10px 13px 10px 13px; 
	`;
	public static readonly FOOTER_DIV_UL_LI = sty.li `
		margin-left: 10px;
		padding-right: 1em;
	`;
	public static readonly A_LINK = sty.a `
		text-decoration: none;
		color: white;
		&:hover {
			color: black;
		}
	`;
	
}
export { Footer };
 
