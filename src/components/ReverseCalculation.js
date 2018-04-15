import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import Sidebar from './Sidebar';


export default class Settings extends Component {



	render() {
		const { loading } = this.state


		return (
			<div className='container'>
				<h1 className='small-header'>
					Reverse Calculation
				</h1>
			</div>
		)
	}


}
