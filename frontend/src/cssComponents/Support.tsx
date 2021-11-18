import sty from "styled-components";
import { Component } from "react";

class Support extends Component
{
	public static readonly SECTION = sty.section `
		box-shadow: 1px 1px 5px #aaaaaa;
		background-color: #f3f3f3;
		display: flex;
		flex-direction: column;
		justify-content: flex-start; 
		align-items: center;
		height: 400px;
		width: 100%;
		font-size: 20px;
	`;
	
	public static readonly SECTION_DIV = sty.div `
		display: inline-flex;
		max-width: 100%;
		max-height: 80%;
		margin-left: 1%;
		margin-right: 5%;
	`;
	
	public static readonly HORZ_LIST = sty.ul `
		list-style-type: none;
		margin: 2% 2%% 2% 2%;
		padding: 0;
		color: black;
		font-weight: bold; 
		font-size: 1.2em;
		margin-top: 20px; 
		width: 100%;
	`;
	
	public static readonly FORM = sty.form `
		font-size: 20px;
		font-family: Arial, sans-serif;
		max-width: 80%;
		min-width: 30vh;
		margin: 10px;
	`;
	
	public static readonly TEXTAREA = sty.textarea `
		width: 50vw;
		height: 200px;
		font-size: 20px;
	`;

	public static readonly INPUT_SUMBIT = sty.input `
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
}
export { Support };
