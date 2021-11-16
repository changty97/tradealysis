import { Component } from "react";
import sty from "styled-components";

class AccountSettings extends Component
{
	public static readonly SECTION = sty.section `
		display: flex;
		flex-direction: column;
		justify-content: flex-start; 
		align-items: flex-start;
		width: 100%;
		font-size: 20px;
		overflow: auto;
	`;
	
	public static readonly HORIZONTAL_LIST_LI_A = sty.a `
		color: rgb(150, 0, 150);
		text-decoration: none;
	`;
	
	public static readonly FORM = sty.form `
		background-color: rgb(240,240,240);
		border-style: solid; 
		border-color: black; 
		border-width: 1px;
		font-family: Arial, sans-serif;
		text-align: center;
		padding: 10px 40px 10px 40px; 
		margin-left: 0%;
		margin-right:0%;
		margin-bottom: 10px;
		border-radius:5px;
	`;
	
	public static readonly FORM_DIV = sty.div `
		box-shadow: 1px 1px 5px #aaaaaa;
		background-color: rgb(240,240,240);
		font-family: Arial, sans-serif;
		text-align: center;
		padding: 10px 40px 10px 40px; 
		margin-left: 0%;
		margin-right:0%;
		margin-bottom: 10px;
		border-radius:4px;
	`;
	
	public static readonly LABEL = sty.label `
		float: left;
		width: 8em;
		clear: left;
		text-align: left;
		padding-right: 2.5em;
		margin-top: 10%;
	`;
	
	public static readonly INPUT = sty.input `
		margin-top: 2em;
		display: block; 
		padding: 10px;
		text-decoration: none;
		font-size: 16px;
		cursor: pointer;
	`;
	public static readonly INPUT_LAST_OF_TYPE = sty.input `
		display: inline-block;
		text-decoration: none;
		font-size: 1.2vw;
		background-color: #008CBA;
		border: none;
		color: black;
		padding: 15px 32px;
		text-align: center;
		text-decoration: none;
		font-size: 16px;
		margin: 4px auto 2px;
		cursor: pointer;
		border-radius: 2px;
		&:hover {
			background-image: linear-gradient(rgba(0, 0, 0, 0.4) 0 0);
		}
	`;
	
	public static readonly UL_HORIZ_LIST = sty.ul `
		box-shadow: 1px 1px 5px #aaaaaa;
		background-color: rgb(240,240,240);
		list-style: none;	
		margin: 0;
		color:black;
		font-weight: bold; 
		font-size: 1.2em;
		border-radius:3px;
	`;
	
	public static readonly UL_HORIZ_LIST_LI = sty.li `
		margin-left: 28%;
		margin-top: 7px;
		margin-bottom: 7px;
	`;
	
	public static readonly ACCOUNT_LIST = sty.div `
		margin-top: 50px; 
		margin-right: auto;
		margin-bottom: auto; 
		margin-left: auto;
	`;
	
}
export { AccountSettings };
