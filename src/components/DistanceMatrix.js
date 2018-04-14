import React, { Component } from 'react';
import ReactDataGrid from 'react-data-grid';
import Update from 'immutability-helper';
import RaisedButton from 'material-ui/RaisedButton';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';


import Columns from './salePoints';
import Rows from './sourcePoints';



export default class DistanceMatrix extends Component {

	constructor(props) {
		super(props);
		this.state = {
			rows: Rows,
			columns: Columns
		};
	}

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


	render() {
		const { rows, columns } = this.state;

		return (
			<div className='container'>
				<Card className='card'>
					<CardTitle title="Price Matrix"  className='cartTitle'/>
					<CardText>
						<div className='distanceMatrix'>
							<div className='btnGroup'>
								<RaisedButton label='Add Sale City' />
								<RaisedButton label='Add Sourcing City' />
							</div>
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
