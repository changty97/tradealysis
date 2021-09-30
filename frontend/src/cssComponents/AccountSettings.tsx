import { Component } from "react";
import sty from "styled-components";

class AccountSettings extends Component
{
	public static readonly SECTION = sty.section `
		border-style: solid; 
		border-color: black; 
		border-width: thin;
		border-radius: 10px;
		background-color: rgb(200,200,200);
		display: flex;
		flex-direction: column;
		justify-content: flex-start; 
		align-items: flex-start;
		height: 550px;
		width: 100%;
		font-size: 20px;
		overflow: auto;
	`;
	
	public static readonly HORIZONTAL_LIST_LI_A = sty.a `
		color: rgb(150, 0, 150);
		text-decoration: none;
	`;
	
	public static readonly FORM = sty.form `
		background-color:rgb(220, 199, 255);
		border-style: solid; 
		border-color: black; 
		border-width: thin;
		font-family: Arial, sans-serif;
		text-align: center;
		padding: 10px 13px 10px 13px; 
		margin-left: 0%;
		margin-right:0%;
	`;
	
	public static readonly LABEL = sty.label `
		float: left;
		width: 8em;
		clear: left;
		text-align: left;
		padding-right: 2em;
		margin-top: 25px; 
	`;
	
	public static readonly INPUT = sty.input `
		margin-top: 2em;
		display: block; 
	`;
	public static readonly INPUT_LAST_OF_TYPE = sty.input `
		margin-top: 2em;
		display: block;
		margin: 20px;
	`;
	
	public static readonly UL_HORIZ_LIST = sty.ul `
		background-color:rgb(199, 203, 255);
		border-style: solid; 
		border-color: rgb(150,100,100); 
		border-width: thin;
		list-style: none;	
		margin: 0;
		color:black;
		font-weight: bold; 
		font-size: 1.2em;
	`;
	
	public static readonly UL_HORIZ_LIST_LI = sty.li `
		display: inline;
		padding-right: 2.5em;
		padding-left: 2.5em;
	`;
	
	public static readonly ACCOUNT_LIST = sty.div `
		margin-top: 50px; 
		margin-right: auto;
		margin-bottom: auto; 
		margin-left: auto;
	`;
	
}
export { AccountSettings };
