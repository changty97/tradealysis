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
		background-color: rgb(170,170,170);
		padding: 0px 10px 10px 0px;
		position: inherit;
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
		color: rgb(130, 0, 130);
		&:hover {
			color: rgb(255, 0, 0);
		}
	`;
	
}
export { Footer };
 
