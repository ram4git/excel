import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import { Statistic, Message } from 'semantic-ui-react'
import ReactDataGrid from 'react-data-grid';

import Moisture from './moisture';
import Cities from './sourcePoints';



export default class ReverseCalculation extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			variety: 'bpt',
			pricePerQnt: 3716.9,
			moisture: 14,
			cities: [],
			rice: 36.96,
			rejected: 3.26,
			smallBroken: 2.73,
			bigBroken: 7.82,
			chaki: 0.39,
			bran: 5.81,
			bran2: 0.89,
			tax: 0,
			atCity: 'Vizag',
			rejectedPrice: 2850,
			smallBrokenPrice: 1750,
			bigBrokenPrice: 2300,
			chakiPrice: 1350,
			branPrice: 1850,
			bran2Price: 1500,
			price75Kg: 1580,
			variety: 'bpt',
			riceBagCapacity: 25,
			brokenBagCapacity: 50,
			millingBagCapacity: 100,
			riceBagPrice: 13,
			brokenBagPrice: 10,
			millingBagPrice: 100,
			taxPc: 5,
		};

		this.data = {

		};
	}

	componentDidMount() {
		const citiesToConsider =  JSON.parse(localStorage.getItem('rows')) || Cities;
		const cities = citiesToConsider.map(row => row.saleCity !== 'priceSource' && row.saleCity);
		this.setState({
			cities
		});
	}

	handleDropdownChange = (key, event, index, value) => this.setState({[key]: value});

	handleMoistureChange(key, event, index, value) {
		const moistureData = Moisture;

		console.log(JSON.stringify(moistureData[this.state.variety][value], null, 2));

		this.setState({
			[key]: value,
			...moistureData[this.state.variety][value]
		});
	}

	onFieldChange(e, newValue) {
		const inputName = e.target.name;
		const newValueNumber = Number.parseFloat(newValue);
		if (Number.isNaN(newValueNumber && newValue !== '')) {
			this.setState({
				errorMsg: `Invalid number "${newValue}" entered for ${inputName}`,
				[inputName]: 0,

			})
		} else {
			this.setState({
				[inputName]: newValue,
				errorMsg: ''
			});
		}
	}


	render() {

		const { loading } = this.state;
		return (
			<div className='container'>
				<h1 className='small-header'>
					Reverse Calculation
				</h1>
				{ this.renderSelections() }
				{ this.renderPaddyPrice() }

				{ this.renderByProducts() }
				{ this.renderByProductProfits() }
				{ this.renderPacking() }
				{ this.renderExpenses() }



			</div>
		)
	}

	renderPacking() {
		return (
			<Card className='card'>
				<CardTitle title="Packaging Costs"  className='cartTitle'/>
				<CardText>
					<div className='container two-column'>
						<div className='column-row'>
							<TextField
								floatingLabelText='Rice Bag Capacity'
								onChange={ this.onFieldChange.bind(this) }
								name='riceBagCapacity'
								value={ this.state.riceBagCapacity}
							/><br />
							<TextField
								floatingLabelText='Broken Bag Capacity'
								onChange={ this.onFieldChange.bind(this) }
								name='brokenBagCapacity'
								value={ this.state.brokenBagCapacity}
							/><br />
							<TextField
								floatingLabelText='Milling Bag Capacity'
								onChange={ this.onFieldChange.bind(this) }
								name='millingBagCapacity'
								value={ this.state.millingBagCapacity}
							/><br />
						</div>
						<div className='column-row'>
							<TextField
								hintText='10'
								floatingLabelText='Rice Bag Price'
								onChange={ this.onFieldChange.bind(this) }
								name='riceBagPrice'
								value={ this.state.riceBagPrice}
							/><br />
							<TextField
								hintText='5'
								floatingLabelText='Broken Bag Price'
								onChange={ this.onFieldChange.bind(this) }
								name='brokenBagPrice'
								value={ this.state.brokenBagPrice}
							/><br />
							<TextField
								hintText='1'
								floatingLabelText='Milling Bag Price'
								onChange={ this.onFieldChange.bind(this) }
								name='millingBagPrice'
								value={ this.state.millingBagPrice}
							/><br />
						</div>
					</div>
				</CardText>
			</Card>
		);
	}

	renderExpenses() {
		const { rice, rejected=0, smallBroken=0, bigBroken=0, chaki=0, price75Kg=0 } = this.state;
		const { riceBagCapacity=25, brokenBagCapacity=50, millingBagCapacity=100 } = this.state;
		const { riceBagPrice, brokenBagPrice, millingBagPrice } = this.state;

		const paddyExpense = 100 * price75Kg;
		const amc = paddyExpense * 0.01;
		const noOfRiceBags = rice / riceBagCapacity * 100;
		const noOfBrokenBags = ( rejected + bigBroken + smallBroken + chaki ) / brokenBagCapacity * 100;
		const noOfMillingBags = 100;

		const ricePackagingCost = (noOfRiceBags * riceBagPrice) || 0;
		const brokenPackagingCost = (noOfBrokenBags * brokenBagPrice) || 0;
		const millingPackagingCost = (noOfMillingBags * millingBagPrice) || 0;

		const riceCost = rice * this.data.costBeforeTax;
		//procurmentCost = riceCost - packingCost + byProductProfit

		const totalPackagingCost = ricePackagingCost + brokenPackagingCost + millingPackagingCost;
		const paddyProcurementCost = riceCost - totalPackagingCost + this.data.byProductIncome;
		const desiredPaddyPriceBeforeAMC = paddyProcurementCost / 1.01 / 100;


		this.data.desiredPaddyPrice = desiredPaddyPriceBeforeAMC;


		const ricePackagingCostStr = Number.parseFloat(ricePackagingCost.toFixed(2)).toLocaleString('en-IN');
		const brokenPackagingCostStr = Number.parseFloat(brokenPackagingCost.toFixed(2)).toLocaleString('en-IN');
		const millingPackagingCostStr = Number.parseFloat(millingPackagingCost.toFixed(2)).toLocaleString('en-IN');
		const paddyProcurementCostStr = Number.parseFloat(paddyProcurementCost.toFixed(2)).toLocaleString('en-IN');
		const desiredPaddyPriceBeforeAMCStr = Number.parseFloat(desiredPaddyPriceBeforeAMC.toFixed(2)).toLocaleString('en-IN');


		return (
			<Card className='card priceCard'>
				<CardTitle title="Total Expenses"  className='cartTitle'/>
				<CardText>
					<div>
						<Statistic.Group widths='four' size='tiny'>
							<Statistic>
								<Statistic.Value>{`₹${ricePackagingCostStr}`}</Statistic.Value>
								<Statistic.Label>Rice Packaging Cost</Statistic.Label>
							</Statistic>
							<Statistic>
								<Statistic.Value>{`₹${brokenPackagingCostStr}`}</Statistic.Value>
								<Statistic.Label>Broken Packaging Cost</Statistic.Label>
							</Statistic>
							<Statistic>
								<Statistic.Value>{`₹${millingPackagingCostStr}`}</Statistic.Value>
								<Statistic.Label>Milling Bags Cost</Statistic.Label>
							</Statistic>
							<Statistic>
								<Statistic.Value>{`₹${desiredPaddyPriceBeforeAMCStr}`} </Statistic.Value>
								<Statistic.Label>Desired Paddy Price</Statistic.Label>
							</Statistic>
						</Statistic.Group>
					</div>
				</CardText>
			</Card>
		);
	}

	renderByProductProfits() {
		const { rejected=0, bigBroken=0, smallBroken=0, chaki=0, bran=0, bran2=0 } = this.state;
		const { rejectedPrice=0, bigBrokenPrice=0, smallBrokenPrice=0, chakiPrice=0, branPrice=0, bran2Price=0 } = this.state;
		const totalIncome =
			rejected * rejectedPrice +
			bigBroken * bigBrokenPrice +
			smallBroken * smallBrokenPrice +
			chaki * chakiPrice +
			bran * branPrice +
			bran2 * bran2Price;
		const tax = totalIncome * 0.05;
		const netIncome = totalIncome * .95;

		const totalIncomeStr = Number.parseFloat(totalIncome.toFixed(2)).toLocaleString('en-IN');
		const taxStr = Number.parseFloat(tax.toFixed(2)).toLocaleString('en-IN');
		const netIncomeStr = Number.parseFloat(netIncome.toFixed(2)).toLocaleString('en-IN');

		this.data.byProductIncome = netIncome;


		return (
			<Card className='card priceCard'>
				<CardText>
					<div>
						<Statistic.Group widths='three' size='tiny'>
							<Statistic>
								<Statistic.Value>{`₹ ${totalIncomeStr}`} </Statistic.Value>
								<Statistic.Label>Total By-products Income</Statistic.Label>
							</Statistic>
							<Statistic>
								<Statistic.Value>{`₹ ${taxStr}`}</Statistic.Value>
								<Statistic.Label>5% Tax</Statistic.Label>
							</Statistic>
							<Statistic>
								<Statistic.Value>{`₹ ${netIncomeStr}`}</Statistic.Value>
								<Statistic.Label>Net By-products Income</Statistic.Label>
							</Statistic>
						</Statistic.Group>
					</div>
				</CardText>
			</Card>
		);
	}


	renderByProducts() {
    return(
      <Card className='card'>
        <CardTitle title="By Product Prices"  className='cartTitle'/>
        <CardText>
          <div className='container two-column'>
            <div className='column-row'>
              <TextField
                hintText='10'
                floatingLabelText='Rejected (KGs)'
                onChange={ this.onFieldChange.bind(this) }
                name='rejected'
                value={ this.state.rejected}
              /><br />
              <TextField
                hintText='10'
                floatingLabelText='Big Broken (KGs)'
                onChange={ this.onFieldChange.bind(this) }
                name='bigBroken'
                value={ this.state.bigBroken}
              /><br />
              <TextField
                hintText='5'
                floatingLabelText='Small Broken (KGs)'
                onChange={ this.onFieldChange.bind(this) }
                name='smallBroken'
                value={ this.state.smallBroken}
              /><br />
              <TextField
                hintText='1'
                floatingLabelText='Chaki (KGs)'
                onChange={ this.onFieldChange.bind(this) }
                name='chaki'
                value={ this.state.chaki}
              /><br />
              <TextField
                hintText='1'
                floatingLabelText='Bran (KGs)'
                onChange={ this.onFieldChange.bind(this) }
                name='bran'
                value={ this.state.bran}
              /><br />
              <TextField
                hintText='1'
                floatingLabelText='Bran 2 (KGs)'
                onChange={ this.onFieldChange.bind(this) }
                name='bran2'
                value={ this.state.bran2}
              /><br />
            </div>
            <div className='column-row'>
              <TextField
                hintText='10'
                floatingLabelText='Rejected Price'
                onChange={ this.onFieldChange.bind(this) }
                name='rejectedPrice'
                value={ this.state.rejectedPrice}
              /><br />
              <TextField
                hintText='10'
                floatingLabelText='Big Broken Price'
                onChange={ this.onFieldChange.bind(this) }
                name='bigBrokenPrice'
                value={ this.state.bigBrokenPrice}
              /><br />
              <TextField
                hintText='5'
                floatingLabelText='Small Broken Price'
                onChange={ this.onFieldChange.bind(this) }
                name='smallBrokenPrice'
                value={ this.state.smallBrokenPrice}
              /><br />
              <TextField
                hintText='1'
                floatingLabelText='Chaki Price'
                onChange={ this.onFieldChange.bind(this) }
                name='chakiPrice'
                value={ this.state.chakiPrice}
              /><br />
              <TextField
                hintText='1'
                floatingLabelText='Bran Price'
                onChange={ this.onFieldChange.bind(this) }
                name='branPrice'
                value={ this.state.branPrice}
              /><br />
              <TextField
                hintText='1'
                floatingLabelText='Bran Price'
                onChange={ this.onFieldChange.bind(this) }
                name='bran2Price'
                value={ this.state.bran2Price}
              /><br />
            </div>
          </div>
        </CardText>
      </Card>
    );
  }


	renderPaddyPrice() {

		const { pricePerQnt, tax } = this.state;
		const freightCharges = JSON.parse(localStorage.getItem('rows')) || Cities;
		const cityFreighChargeRow = freightCharges.find( row => row.saleCity === this.state.atCity);
		const freightCharge = cityFreighChargeRow.peddapuram;

		const costBeforeTax = ((pricePerQnt - freightCharge) / (100 + Number.parseFloat(tax)) * 100).toFixed(2);
		const taxToPay = (costBeforeTax * tax / 100).toFixed(2);

		this.data.costBeforeTax = costBeforeTax;



	return (
		<Card className='card priceCard'>
		  <CardText>
		    <div>
		      <Statistic.Group widths='three' size='tiny'>
		        <Statistic>
		          <Statistic.Value>{`₹ ${freightCharge}`} </Statistic.Value>
		          <Statistic.Label>Freight Charge</Statistic.Label>
		        </Statistic>
					</Statistic.Group>
					<TextField
						hintText='1'
						floatingLabelText='Tax'
						onChange={ this.onFieldChange.bind(this) }
						name='tax'
						value={ this.state.tax}
					/><br />

					<Statistic.Group size='tiny'>
		        <Statistic>
		          <Statistic.Value>{`₹ ${taxToPay}`}</Statistic.Value>
		          <Statistic.Label>5% Tax</Statistic.Label>
		        </Statistic>
		        <Statistic>
		          <Statistic.Value>{`₹ ${costBeforeTax}`}</Statistic.Value>
		          <Statistic.Label>Cost before Tax</Statistic.Label>
		        </Statistic>
		      </Statistic.Group>
		    </div>
		  </CardText>
		</Card>
	);
	}

	renderSelections() {
		const citiesArray = [];
		this.state.cities.forEach(city => {
			citiesArray.push(<MenuItem key={city} value={city} primaryText={city} />);
		});
		return (
			<Card className='card'>
				<CardTitle title="Selections"  className='cartTitle'/>
				<CardText>
					<div className='container two-column selections'>
						<SelectField
							floatingLabelText='Rice Variety'
							value={this.state.variety}
							onChange={this.handleDropdownChange.bind(this, 'variety')}
							className='select-field' >
							<MenuItem key={1} value='bpt' primaryText={`BPT`} />
							<MenuItem key={2} value='swarna' primaryText={`SWARNA`} />
						</SelectField>
						{ this.renderMoistureOptions() }
						<TextField
							hintText='1400'
							floatingLabelText='Desired Price/Qnt'
							errorStyle={{color: '#7f8c8d'}}
							onChange={this.onFieldChange.bind(this)}
							name='pricePerQnt'
							value={ this.state.pricePerQnt }
						/>
						<SelectField
							floatingLabelText='at City'
							value={this.state.atCity}
							onChange={this.handleDropdownChange.bind(this, 'atCity')}
							className='select-field' >
							{ citiesArray }
						</SelectField>
					</div>
				</CardText>
			</Card>
		);
	}

	renderMoistureOptions() {
		const menuItemArray = [];
		menuItemArray.push(<MenuItem key={14} value={14} primaryText={`${14}`} />);
		menuItemArray.push(<MenuItem key={17} value={17} primaryText={`${17}`} />);
		menuItemArray.push(<MenuItem key={20} value={20} primaryText={`${20}`} />);
		menuItemArray.push(<MenuItem key={22} value={22} primaryText={`${22}`} />);
		menuItemArray.push(<MenuItem key={25} value={25} primaryText={`${25}`} />);

		return(
			<SelectField
				floatingLabelText='Moisture %'
				value={this.state.moisture}
				onChange={this.handleMoistureChange.bind(this,'moisture')}
				className='select-field'
			>
			{ menuItemArray }
			</SelectField>
		);
	}


}
