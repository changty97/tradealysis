import { Component } from "react";
import { Link } from "react-router-dom";
import sty from "styled-components";

/**
	Header CSS
**/
class Header extends Component
{
	public static readonly A_LINK = sty.a `
		text-decoration: none;
	`;
	public static readonly LINK_1  = sty(Link)`
		text-decoration: none;
		color: #839a9b; 
		&:hover {
			color: black;
		}
	`;
	public static readonly THE_HEADER = sty.div `
		margin: 0% 5%;
		border-bottom: 1px solid #839a9b29;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
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
		padding: 9px 40px 9px 40px;
		color: #839a9b;
	`;
	
	public static readonly HEADER_BUTTONS_LIST_LI_NOHOVER = sty.li `
		list-style-type: none;
		border: 1px solid black;
		background-color: rgb(100,100,100);
		margin-left: 5%;
		padding: 9px 60px 9px 60px;
		color: white;
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
	public static readonly USER_DROP_DOWN_CONTENT = sty.div `
		display: none;
		position: fixed;
		background-color: #f9f9f9;
		min-width: 160px;
		box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
		padding: 12px 16px;
		z-index: 1;
		right: 4px;
		float: left;
	`;
	public static readonly USER_DROP_DOWN = sty.div `
		position: relative;
		display: inline-block;
		&:hover ${Header.USER_DROP_DOWN_CONTENT} {
			display: block;
		}
	`;

	public static readonly NOWRAP = sty.div `
		white-space: nowrap;
	`;
	
	public static readonly LOGOUT_BUTTON = sty.button `
		margin-right: 1.7%;
		padding-left: 25px;
		padding-right: 25px;
		padding-top: 2px;
		padding-bottom: 2px;
		
		position: absolute;
		top: 10px;
		right: 20px;
	`;
}
export { Header };
