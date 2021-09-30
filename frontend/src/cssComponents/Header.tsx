import { Component } from "react";
import { Link } from "react-router-dom";
import sty from "styled-components";

class Header extends Component
{
	public static readonly A_LINK = sty.a `
		text-decoration: none;
	`;
	public static readonly LINK_1  = sty(Link)`
		text-decoration: none;
	`;
	public static readonly THE_HEADER = sty.div `
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		margin-left: 5%;
		flex-wrap: wrap;  
	`;
	public static readonly HEADER_BUTTONS_LIST = sty.ul `
		display: flex;               
		flex-direction: row;
		font-size: 2em;
		justify-content: flex-start; 
		align-items: center;
	`;
	public static readonly HEADER_BUTTONS_LIST_LI = sty.li `
		list-style-type: none;
		border: 1px solid black;
		background-color: rgb(100,100,100);
		margin-left: 5%;
		padding: 9px 60px 9px 60px;
		&:hover {
			background-color: rgb(120,120,120); 
		}
	`;
	public static readonly HEADER_BUTTONS_LIST_LI_A = sty.a `
		color: white; 
		text-decoration: none;
	`;
	public static readonly USER_AND_SETTINGS_BUTTONS = sty.div `
		margin-left: auto; 
		margin-right: 0;
		white-space: nowrap;
	`;
	public static readonly LOGIN_NEW_ACCOUNT_BUTTON = sty.div `
		margin-left: auto; 
		margin-right: 0;
		white-space: nowrap;
	`;
	public static readonly NOWRAP = sty.div `
		white-space: nowrap;
	`;
}
export { Header };
 