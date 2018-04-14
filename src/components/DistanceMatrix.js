import React, { Component } from 'react';
import ReactDataGrid from 'react-data-grid';
import Update from 'immutability-helper';
import RaisedButton from 'material-ui/RaisedButton';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Snackbar from 'material-ui/Snackbar';

import { Divider } from 'semantic-ui-react'



import Columns from './salePoints';
import Rows from './sourcePoints';



export default class DistanceMatrix extends Component {

	constructor(props) {
		super(props);
		this.state = {
			rows: Rows,
			columns: Columns,
			action: 'add',
			cityType: 'saleCity',
			open: false,
		};
	}

	handleRequestClose = () => this.setState({ open: false, snackMessage: ''});
	handleDropdownChange = (key, event, index, value) => this.setState({[key]: value});
	onFieldChange = (e, newValue) => this.setState({[e.target.name]: newValue,});


	rowGetter = rowNumber => this.state.rows[rowNumber];

	handleGridRowsUpdated = ({ fromRow, toRow, updated }) => {
		const rows = this.state.rows.slice();

		for (let i = fromRow; i <= toRow; i++) {
			const rowToUpdate = rows[i];
			const updatedRow = Update(rowToUpdate, {$merge: updated});
			rows[i] = updatedRow;
		}

		this.setState({ rows });
	};

	performSelectedAction() {
		const { city='', action, cityType } = this.state;
		const rows = this.state.rows.slice();
		const columns = this.state.columns.slice();
		const cityKey = city.split(' ').join('').split('.').join('');

		if(action === 'add') {
			if(cityType === 'saleCity') {
				const newRow = {...rows[0]};
				newRow.saleCity = city
				rows.push(newRow);
				this.setState({
					rows,
					snackMessage: `Sale City "${city}" has been added.`,
					open: true,
				});
			} else if(cityType === 'sourceCity') {
				for (let i = 0; i < rows.length; i++) {
					const rowToUpdate = {...rows[i]};
					rowToUpdate[cityKey] = '0';
					rows[i] = rowToUpdate;
				}
				columns.push({
					key: cityKey, name: city, editable: true
				});
				this.setState({
					rows,
					columns,
					snackMessage: `Sourcing City "${city}" has been added.`,
					open: true,
				});
			}

		} else if (action === 'remove') {
			if(cityType === 'saleCity') {
				const newRows = rows.filter(row => row.saleCity !== city);
				this.setState({
					rows: newRows,
					snackMessage: `Sale City "${city}" has been removed.`,
					open: true,
				});

			} else if(cityType === 'sourceCity') {
				for (let j = 0; j < rows.length; j++) {
					const rowToUpdate = {...rows[j]};
					delete rowToUpdate[cityKey];
					rows[j] = rowToUpdate;
				}
				const newColumns = columns.filter(column => column.key !== cityKey);
				this.setState({
					rows,
					columns: newColumns,
					snackMessage: `Sourcing City "${city}" has been removed.`,
					open: true,
				});

			}

		}
	}


	render() {
		const { rows, columns } = this.state;

		return (
			<div className='container'>
				<Snackbar
					open={this.state.open}
					message={this.state.snackMessage}
					autoHideDuration={4000}
					onRequestClose={this.handleRequestClose}
				/>
				<Card className='card'>
					<CardTitle title="Price Matrix"  className='cartTitle'/>
					<CardText>
						<div className='distanceMatrix'>
							<div className='btnGroup'>
								<TextField
									hintText='city name'
									floatingLabelText='name of city'
									onChange={ this.onFieldChange.bind(this) }
									name='city'
									value={ this.state.city}
								/>
								<SelectField
									floatingLabelText='Action'
									value={this.state.action}
									onChange={this.handleDropdownChange.bind(this, 'action')}
									className='select-field' >
									<MenuItem key={1} value='add' primaryText={`ADD`} />
									<MenuItem key={2} value='remove' primaryText={`REMOVE`} />
								</SelectField>
								<SelectField
									floatingLabelText='cityType'
									value={this.state.cityType}
									onChange={this.handleDropdownChange.bind(this, 'cityType')}
									className='select-field' >
									<MenuItem key={1} value='saleCity' primaryText={`Sale City`} />
									<MenuItem key={2} value='sourceCity' primaryText={`Sourcing City`} />
								</SelectField>
							</div>
							<div className='btnGroup'>
								<RaisedButton label='Perform Action on City Type'
									primary={true}
									fullWidth={true}
									onClick={this.performSelectedAction.bind(this)} />
							</div>
							<Divider horizontal>Change Freight Charge</Divider>


							<ReactDataGrid
								className='dataTable'
								columns={this.state.columns}
								rowGetter={this.rowGetter}
								rowsCount={rows.length}
								enableCellSelect={true}
								onGridRowsUpdated={this.handleGridRowsUpdated}
								minHeight={500} />
								<div className='btnGroup'>
							    <RaisedButton label='Save' primary={true}  fullWidth={true}/>
								</div>
						</div>
					</CardText>
				</Card>
			</div>
		);
	}
}


class PercentCompleteFormatter extends React.Component {

  render() {
		return (
			<div className='name'>
					{this.props.value}
			</div>);
  }
}
