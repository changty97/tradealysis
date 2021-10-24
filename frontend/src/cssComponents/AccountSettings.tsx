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
		height: 600px;
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
		border-radius:4px;
	`;
	
	public static readonly LABEL = sty.label `
		float: left;
		width: 8em;
		clear: left;
		text-align: left;
		padding-right: 2.5em;
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
		background-color: rgb(240,240,240);
		border-style: solid; 
		border-color: rgb(150,100,100); 
		border-width: 1px;
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
