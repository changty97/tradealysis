import { Component } from "react";
//import { Link } from "react-router-dom";
import sty from "styled-components";

class Login extends Component
{
	public static readonly SECTION = sty.section `
		border-style: solid; 
		border-color: black; 
		border-width: thin; 
		background-color: rgb(200,200,200);
		display: flex; 
		flex-direction: row;
		justify-content: center; 
		align-items: center;
		height: 550px; width: 100%;
		border-radius: 10px; 
		flex-shrink: 2;
	`;
	public static readonly LOGIN_BOX = sty.div `
		background-color: rgb(40, 40, 40);
		background-image: url("./login2.jpg");
		background-size: cover;
		border-style: solid; 
		border-color: black; 
		border-width: thick;
		display: inline-flex;
		flex-direction: column;
		justify-content: center; 
		allign-content: flex-start;
		height: 70%; 
		width: 25%;  
		white-space: wrap;
		padding: 20px;
	`;
	
	public static readonly USERNAME_AND_PASSWORD_TXT_BOXES = sty.div `
		display: inline-flex;
		flex-direction: column;
		justify-content: center;
		allign-content: center;
		width: 100%;
		margin-bottom: 10px;
	`;
	public static readonly LOGIN_BUTTON = sty.div `
		display: inline-flex;
		flex-direction: column;
		justify-content: left;
		allign-content: left;
		width: 102.5%;
	`;
	
	public static readonly USERNAME_OR_PSWD_INPUT = sty.input `
		font-size: 1.8vh;
		height: 100%;
		width: 100%;
	`;
	public static readonly FORGOT_PSSD_BUTTON = sty.button `
		font-size: 1.8vh;
	`;
	
}
export { Login };
 
