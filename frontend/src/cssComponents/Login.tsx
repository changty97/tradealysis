import { Component } from "react";
import sty from "styled-components";

class Login extends Component
{
	public static readonly SECTION = sty.section `		 
		display: flex; 
		flex-direction: column;
		justify-content: center; 
		align-items: center;
		height: 80vh; 
		width: 100%;
		border-radius: 10px; 
		flex-shrink: 2;
	`;
	public static readonly LOGIN_BOX = sty.div`
		box-shadow: 1px 1px 5px #aaaaaa;
		background-color: rgb(240,240,240);
		display: inline-flex;
		flex-direction: column;
		justify-content: center; 
		allign-content: flex-start;
		margin-bottom:5%;
		height: 63%; 
		width: 25vw;  
		white-space: wrap;
		padding: 20px;
		border-radius: 8px;
	`;
	
	public static readonly WELCOME_LABEL = sty.label `
		font-weight: bold;
	`;
	public static readonly LOGIN_LABEL_DIV = sty.div `
		display: inline-flex;
		flex-direction: row;
		justify-content: center; 
		allign-content: center;
		margin: 2%;
		font-size: 3.5vh;
		
	`;
	public static readonly FORM = sty.form `
		width: 100%;
		height: 100%;
		display: inline-flex;
		flex-direction: column;
		justify-content: center; 
		allign-content: flex-start;
	`;
	public static readonly USERNAME_AND_PASSWORD_TXT_BOXE_LABELS = sty.label `
		display: inline-flex;
		flex-direction: column;
		justify-content: center;
		allign-content: center;
		font-size: 1.9vh;
		font-weight: bold;
		margin-top: 1.5%;
	`;
	
	public static readonly USERNAME_AND_PASSWORD_TXT_BOXES = sty.div `
		display: inline-flex;
		flex-direction: column;
		justify-content: center;
		allign-content: center;
		margin: 2%;
		margin-bottom: 3.5%;
		
	`;
	public static readonly LOGIN_BUTTON = sty.div `
		display: inline-flex;
		flex-direction: column;
		justify-content: center;
		allign-content: center;
		margin: 2%;
	`;
	
	public static readonly USERNAME_OR_PSWD_INPUT = sty.input `
		margin-top: 1%;
		font-size: 3.8vh;
	`;
	
	public static readonly FORGOT_PSSD_BUTTON = sty.button `
		text-decoration: none;
		
		background-color: #0099cc;
		border: 1px solid black;
		color: black;
		padding: 1.5% 6%;
		text-align: center;
		text-decoration: none;
		display: inline-block;
		font-size: 2.3vh;
		margin: 4px 2px;
		cursor: pointer;
		border-radius: 2px;
		&:hover {
			background-image: linear-gradient(rgba(0, 0, 0, 0.4) 0 0);
			color: white;
		}
	`;
	
	public static readonly INVALID_LOGIN_MSSG = sty.label `
		font-size: 2.3vh;
		text-align: center;
		position: relative;
		top: 3%;
	`;
}
export { Login };
