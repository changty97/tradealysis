import { Component } from "react";
import sty from "styled-components";

class AccountSettings extends Component
{
	public static readonly AS_LABEL = sty.label `
		font-size:22px;
	`;

	public static readonly SECTION = sty.section `
		display: flex;
		flex-direction: column;
		justify-content: center; 
		align-items: center;
		margin-top: 20px;
		font-size: 16px; 
		margin-bottom: 100px;
		font-family: Arial, sans-serif;
		text-align: center;
		padding: 0px 100px 0px 100px; 
		margin-left: 10%;
		margin-right: 10%;
		border-radius:12px;
	`;
	
	public static readonly SECTION_INNER = sty.div `
		padding: 1%;
		padding-top: 30px;
		padding-left: 200px;
		padding-right: 200px;
		padding-bottom: 30px;
		box-shadow: 1px 1px 5px #aaaaaa;
		border-radius:10px;
		background-color: rgb(240,240,240);
	`;
	
	public static readonly FORM_DIV = sty.div `
		margin-top: 5px;
		display: flex;
		flex-direction: row;
		justify-content: center; 
		align-items: center;
	`;
	
	public static readonly FORM_DIV_ITEM1 = sty.div `
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-content: flex-start;
	`;
	
	public static readonly LABEL = sty.label `
		margin-top: 0.5em; 
		padding: 7.5px;
		text-decoration: none;
		font-size: 16px;
		cursor: pointer;
		white-space: nowrap;
	`;
	
	public static readonly INPUT = sty.input `
		margin-top: 0.5em; 
		padding: 5px;
		text-decoration: none;
		font-size: 16px;
		cursor: pointer;
	`;
	
	public static readonly SUBMIT_BUTTON = sty.input `
		padding: 7px;
		margin-top: 12px;
		font-size: 12px;
		color: white;
		background-color: rgb(0,80,160);
		&:hover {
			background-image: linear-gradient(rgba(0, 0, 0, 0.5) 0 0);
			color: white;
		}
	`;
}
export { AccountSettings };
