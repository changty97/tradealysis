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
		height: 800px;
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
		padding: 1em;
		margin-top: 2rem;
		margin-right: auto;
		margin-left: auto;
		font-size: 20px;
		font-family: Arial, sans-serif;
		max-width: 80%;
		min-width: 30vh;
	`;
	
	public static readonly INPUT_TWO = sty.input `
		width: 100%;
		height: 100px;
		padding: 0.7em;
		margin-bottom: 0.5rem;
		font-size: 20px;
	`;
	
	public static readonly INPUT = sty.input `
		width: 100%;
		height: 15px;
		padding: 0.7em;
		margin-bottom: 0.5rem;
		font-size: 20px;
	`;

	public static readonly LABEL = sty.label `
		text-align: left;
		display: block;
		padding: 0.5em 1.5em 0.5em 0;
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
