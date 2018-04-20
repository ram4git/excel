import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import { processBrokenData } from '../api';
import TeamLogo from './TeamLogo';
import Team from './Team';
import Loading from './Loading';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import { Statistic, Message } from 'semantic-ui-react';
import {
    Accordion,
    AccordionItem,
    AccordionItemTitle,
    AccordionItemBody,
} from 'react-accessible-accordion';
import 'react-accessible-accordion/dist/fancy-example.css';


import ReactDataGrid from 'react-data-grid';

import Moisture from './moisture';




import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

const MOISTURE_START_INDEX = 14;
const MOISTURE_END_INDEX = 25;



export default class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      variety: 'bpt',
      paddyInTons: 193,
      rejectedIn36Secs: 3.8,
      rice: 36.96,
      rejected: 3.26,
      smallBroken: 2.73,
      bigBroken: 7.82,
      chaki: 0.39,
      bran: 5.81,
      bran2: 0.89,
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
  }


  handleDropdownChange = (key, event, index, value) => {
    this.setState({[key]: value});
    if(key === 'variety') {
      this.setState({
        moisture: ''
      });
    }

  }

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

  on75KgPriceChange(e, newValue) {
    this.setState({
      price75Kg: newValue
    });
  }

  render() {
    const { loading } = this.state

    return (
      <div className='container'>
        <h1 className='small-header'>
          Price Calculation
        </h1>
        { this.renderErrorMsg() }
				{ this.renderSelections() }
        <Accordion>
          <AccordionItem>
              <AccordionItemTitle>
                  <h3>By Product Weights</h3>
              </AccordionItemTitle>
              <AccordionItemBody>
                { this.renderWeights() }
              </AccordionItemBody>
          </AccordionItem>
          <AccordionItem>
              <AccordionItemTitle>
                  <h3>By Products Income</h3>
              </AccordionItemTitle>
              <AccordionItemBody>
                { this.renderByProducts() }
                { this.renderByProductProfits() }
              </AccordionItemBody>
          </AccordionItem>

          <AccordionItem>
              <AccordionItemTitle>
                  <h3>Packaging Costs</h3>
              </AccordionItemTitle>
              <AccordionItemBody>
                { this.renderPacking() }
                { this.renderExpenses() }
              </AccordionItemBody>
          </AccordionItem>
        </Accordion>
        { this.renderRicePrice() }
      </div>
    )
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


	renderSelections() {
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
              <MenuItem key={2} value='1010White' primaryText={`1010 White`} />
              <MenuItem key={3} value='1010PB' primaryText={`1010 PB`} />
            </SelectField>
            { this.renderMoistureOptions() }
            <TextField
              hintText='1400'
              floatingLabelText='Price/75KG'
              errorStyle={{color: '#7f8c8d'}}
              onChange={ this.on75KgPriceChange.bind(this) }
              name='price75Kg'
              value={ this.state.price75Kg }
            />
          </div>
				</CardText>
			</Card>
		);
	}

  renderErrorMsg() {
    if(this.state.errorMsg) {
      return(
        <Message negative>
          <p>{this.state.errorMsg}</p>
        </Message>
      );
    }
  }

  renderStats() {
    return (
      <Card className='card priceCard'>
        <CardText>
          { this.renderFinalStats() }
        </CardText>
      </Card>
    );
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
    const { rice, rejected, smallBroken, bigBroken, chaki, price75Kg } = this.state;
    const { riceBagCapacity, brokenBagCapacity, millingBagCapacity } = this.state;
    const { riceBagPrice, brokenBagPrice, millingBagPrice } = this.state;

    const paddyExpense = 100 * price75Kg;
    const amc = paddyExpense * 0.01;
    const noOfRiceBags = rice / riceBagCapacity * 100;
    const noOfBrokenBags = ( rejected + bigBroken + smallBroken + chaki ) / brokenBagCapacity * 100;
    const noOfMillingBags = 100;

    const ricePackagingCost = noOfRiceBags * riceBagPrice;
    const brokenPackagingCost = noOfBrokenBags * brokenBagPrice;
    const millingPackagingCost = noOfMillingBags * millingBagPrice;
    const paddyProcurementCost = 100 * price75Kg;
    const amcCost = paddyProcurementCost * 0.01;
    const totalExpense = ricePackagingCost + brokenPackagingCost + millingPackagingCost + paddyProcurementCost + amcCost;


    const ricePackagingCostStr = Number.parseFloat(ricePackagingCost.toFixed(2)).toLocaleString('en-IN');
    const brokenPackagingCostStr = Number.parseFloat(brokenPackagingCost.toFixed(2)).toLocaleString('en-IN');
    const millingPackagingCostStr = Number.parseFloat(millingPackagingCost.toFixed(2)).toLocaleString('en-IN');
    const paddyProcurementCostStr = Number.parseFloat(paddyProcurementCost.toFixed(2)).toLocaleString('en-IN');
    const amcCostStr = Number.parseFloat(amcCost.toFixed(2)).toLocaleString('en-IN');
    const totalExpenseStr = Number.parseFloat(totalExpense.toFixed(2)).toLocaleString('en-IN');


    return (
      <Card className='card priceCard'>
        <CardTitle title="Total Expenses"  className='cartTitle'/>
        <CardText>
          <div>
            <Statistic.Group widths='four' size='tiny'>
              <Statistic>
                <Statistic.Value>{`₹${paddyProcurementCostStr}`} </Statistic.Value>
                <Statistic.Label>Paddy Procurement Cost</Statistic.Label>
              </Statistic>
              <Statistic>
                <Statistic.Value>{`₹${amcCostStr}`} </Statistic.Value>
                <Statistic.Label>AMC 1%</Statistic.Label>
              </Statistic>
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
                <Statistic.Value>{`₹${totalExpenseStr}`}</Statistic.Value>
                <Statistic.Label>Total Expenses</Statistic.Label>
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

  renderRicePrice() {


    const { rejected=0, bigBroken=0, smallBroken=0, chaki=0, bran=0, bran2=0 } = this.state;
    const { rejectedPrice=0, bigBrokenPrice=0, smallBrokenPrice=0, chakiPrice=0, branPrice=0, bran2Price=0 } = this.state;
    const { rice, price75Kg, taxPc } = this.state;
    const { riceBagCapacity, brokenBagCapacity, millingBagCapacity } = this.state;
    const { riceBagPrice, brokenBagPrice, millingBagPrice } = this.state;


    const totalIncome =
      rejected * rejectedPrice +
      bigBroken * bigBrokenPrice +
      smallBroken * smallBrokenPrice +
      chaki * chakiPrice +
      bran * branPrice +
      bran2 * bran2Price;
    const netIncome = totalIncome * .95;


    const paddyExpense = 100 * price75Kg;
    const amc = paddyExpense * 0.01;
    const noOfRiceBags = rice / riceBagCapacity * 100;
    const noOfBrokenBags = ( rejected + bigBroken + smallBroken + chaki ) / brokenBagCapacity * 100;
    const noOfMillingBags = 100;

    const ricePackagingCost = noOfRiceBags * riceBagPrice;
    const brokenPackagingCost = noOfBrokenBags * brokenBagPrice;
    const millingPackagingCost = noOfMillingBags * millingBagPrice;
    const paddyProcurementCost = 100 * price75Kg;
    const amcCost = paddyProcurementCost * 0.01;
    const totalExpense = ricePackagingCost + brokenPackagingCost + millingPackagingCost + paddyProcurementCost + amcCost;


    const costPerQuintal = (totalExpense - netIncome) / rice;
    const tax = costPerQuintal * taxPc / 100;
    const finalPricePerQuintal = costPerQuintal + tax;

    const netIncomeStr = Number.parseFloat(netIncome.toFixed(2)).toLocaleString('en-IN');
    const totalExpenseStr = Number.parseFloat(totalExpense.toFixed(2)).toLocaleString('en-IN');
    const costPerQuintalStr = Number.parseFloat(costPerQuintal.toFixed(2)).toLocaleString('en-IN');
    const taxPcStr = Number.parseFloat(tax.toFixed(2)).toLocaleString('en-IN');
    const finalPricePerQuintalStr = Number.parseFloat(finalPricePerQuintal.toFixed(2)).toLocaleString('en-IN');




    return (
      <Card className='card priceCard'>
        <CardText>
          <div>
            <Statistic.Group widths='three' size='tiny'>
              <Statistic>
                <Statistic.Value>{`₹${totalExpenseStr}`}</Statistic.Value>
                <Statistic.Label>Total Expenses</Statistic.Label>
              </Statistic>
              <Statistic>
                <Statistic.Value>{`₹${netIncomeStr}`} </Statistic.Value>
                <Statistic.Label>By-products Income</Statistic.Label>
              </Statistic>
              <Statistic>
                <Statistic.Value>{`₹${costPerQuintalStr}`}</Statistic.Value>
                <Statistic.Label>Cost per Quintal</Statistic.Label>
              </Statistic>
            </Statistic.Group>
            <TextField
              hintText='5'
              floatingLabelText='Tax %'
              onChange={ this.onFieldChange.bind(this) }
              name='taxPc'
              className='centerTaxField'
              value={ this.state.taxPc}
            /><br />

            <Statistic.Group widths='two'>
              <Statistic>
                <Statistic.Value>{`₹${taxPcStr}`}</Statistic.Value>
                <Statistic.Label>5% tax</Statistic.Label>
              </Statistic>
              <Statistic>
                <Statistic.Value>{`₹ ${finalPricePerQuintalStr}`}</Statistic.Value>
                <Statistic.Label>Price per Quintal</Statistic.Label>
              </Statistic>
            </Statistic.Group>
          </div>
          <div>
          <Accordion>
            <AccordionItem>
                <AccordionItemTitle>
                    <h3>Cost Matrix</h3>
                </AccordionItemTitle>
                <AccordionItemBody>
                  { this.renderPriceWithFreight(finalPricePerQuintal) }
                </AccordionItemBody>
            </AccordionItem>
          </Accordion>
          </div>
        </CardText>
      </Card>
    );
  }

  renderPriceWithFreight(finalPricePerQuintal) {
    const rows =  JSON.parse(localStorage.getItem('rows')) || [{}];
    const columns = JSON.parse(localStorage.getItem('columns')) || [{}];
    return (
      <ReactDataGrid
        className='dataTable'
        columns={columns}
        rowGetter={this.rowGetter.bind(this, rows, finalPricePerQuintal)}
        rowsCount={rows.length - 1}
        minHeight={500} />
    );
  }

  rowGetter(rows, pricePerQuintal, rowNumber) {
    const originPrices = { ...rows[0] };
    originPrices.peddapuram = 0;
    const rowToReturn = { ...rows[rowNumber + 1]};

    rowToReturn.peddapuram = (Number.parseFloat(rowToReturn.peddapuram) + Number.parseFloat(pricePerQuintal)).toFixed(2) ;

    Object.keys(rowToReturn).forEach(city => {
      if(city === 'saleCity' || city === 'peddapuram') {
        return;
      }
      rowToReturn[city] = (Number.parseFloat(rowToReturn[city]) +
        Number.parseFloat(this.getRicePricePerGivenPaddyPriceWithSameSettings(originPrices[city]))).toFixed(2);
    })

    return ({ ...rowToReturn });

  }


  getRicePricePerGivenPaddyPriceWithSameSettings(paddyPrice) {

  // By products Income
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

  // Packaging costs
  const { rice, taxPc } = this.state;
  const { riceBagCapacity, brokenBagCapacity, millingBagCapacity } = this.state;
  const { riceBagPrice, brokenBagPrice, millingBagPrice } = this.state;

  const paddyExpense = 100 * paddyPrice;
  const amc = paddyExpense * 0.01;
  const noOfRiceBags = rice / riceBagCapacity * 100;
  const noOfBrokenBags = ( rejected + bigBroken + smallBroken + chaki ) / brokenBagCapacity * 100;
  const noOfMillingBags = 100;

  const ricePackagingCost = noOfRiceBags * riceBagPrice;
  const brokenPackagingCost = noOfBrokenBags * brokenBagPrice;
  const millingPackagingCost = noOfMillingBags * millingBagPrice;
  const paddyProcurementCost = 100 * paddyPrice;
  const amcCost = paddyProcurementCost * 0.01;
  const totalExpense = ricePackagingCost + brokenPackagingCost + millingPackagingCost + paddyProcurementCost + amcCost;


  const costPerQuintal = (totalExpense - netIncome) / rice;
  const riceTax = costPerQuintal * taxPc / 100;
  const finalPricePerQuintal = costPerQuintal + riceTax;

  return finalPricePerQuintal
  }



  renderFinalStats() {
    const { rejectedInKg = '0.0' } = processBrokenData(this.state);
    const { price75Kg, moisture } = this.state;
    const priceAt14PcMoisture = price75Kg * (100-14)/(100-moisture);
    return (
      <div>
        <Statistic.Group widths='three'>
          <Statistic>
            <Statistic.Value>{`${rejectedInKg} KGs`} </Statistic.Value>
            <Statistic.Label>Rejected In KGs</Statistic.Label>
          </Statistic>
          <Statistic>
            <Statistic.Value>{`₹ ${Number.parseFloat(priceAt14PcMoisture).toFixed(2)}`}</Statistic.Value>
            <Statistic.Label>Price @ 14% moisture - 75KG</Statistic.Label>
          </Statistic>
        </Statistic.Group>
      </div>
    );
  }

  renderInputSettings() {
    return (
      <div className='container two-column'>
        <div className='column-row'>
          <TextField
            hintText='193'
            floatingLabelText='Total Paddy Processed in Tons'
            onChange={ this.onFieldChange.bind(this) }
            name='paddyInTons'
            value={ this.state.paddyInTons}
          /><br />
          <TextField
            hintText='3.8'
            floatingLabelText='Rejected for 36 seconds in KGs'
            onChange={ this.onFieldChange.bind(this) }
            name='rejectedIn36Secs'
            value={ this.state.rejectedIn36Secs}
          /><br />
        </div>
        <div className='column-row'>
          <TextField
            hintText='10'
            floatingLabelText='Big Broken %'
            onChange={ this.onFieldChange.bind(this) }
            name='bigBroken'
            value={ this.state.bigBroken}
          /><br />
          <TextField
            hintText='5'
            floatingLabelText='Small Broken %'
            onChange={ this.onFieldChange.bind(this) }
            name='smallBroken'
            value={ this.state.smallBroken}
          /><br />
          <TextField
            hintText='1'
            floatingLabelText='Chaki %'
            onChange={ this.onFieldChange.bind(this) }
            name='chaki'
            value={ this.state.chaki}
          /><br />
          <TextField
            hintText='1'
            floatingLabelText='bran'
            onChange={ this.onFieldChange.bind(this) }
            name='bran'
            value={ this.state.bran}
          /><br />
          <TextField
            hintText='1'
            floatingLabelText='bran 2'
            onChange={ this.onFieldChange.bind(this) }
            name='bran2'
            value={ this.state.bran2}
          /><br />
        </div>
      </div>

    );
  }

  renderSettings() {
    return (
      <Card className='card'>
        <CardTitle title="Constituen"  className='cartTitle'/>
        <CardText>
          { this.renderInputSettings() }
        </CardText>
      </Card>
    );
  }

  renderWeights(){
    return (
      <Card className='card'>
        <CardTitle title="Weights"  className='cartTitle'/>
        <CardText>
          { this.renderFinalWeights() }
        </CardText>
      </Card>
    );
  }

  renderFinalWeights(){
    const data = processBrokenData(this.state);
    return(
      <Table
        headerStyle= {{fontSize: '20', fontWeight: 'bold'}}
        >
        <TableHeader
          adjustForCheckbox={false}
          displaySelectAll={false}
          className='tableHeader'
          >
          <TableRow>
            <TableHeaderColumn style={{fontSize: '20px'}}>Constituent (KGs)</TableHeaderColumn>
            <TableHeaderColumn style={{textAlign: 'right', fontSize: '20px'}}>For 75KGs Paddy</TableHeaderColumn>
            <TableHeaderColumn style={{textAlign: 'right', fontSize: '20px'}}>For 100KG Paddy</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody
          displayRowCheckbox={false}
          >
          <TableRow>
            <TableRowColumn style={{fontSize: '20px'}}>REJECTED</TableRowColumn>
            <TableRowColumn style={{textAlign: 'right', fontSize: '20px'}}>{data.rejectedInKg}</TableRowColumn>
            <TableRowColumn style={{textAlign: 'right', fontSize: '20px'}}>{Number.parseFloat(data.rejectedInKg * 4/3).toFixed(3)}</TableRowColumn>
          </TableRow>
          <TableRow>
            <TableRowColumn style={{fontSize: '20px'}}>BIG BROKEN</TableRowColumn>
            <TableRowColumn style={{textAlign: 'right', fontSize: '20px'}}>{data.bigBrokenInKg}</TableRowColumn>
            <TableRowColumn style={{textAlign: 'right', fontSize: '20px'}}>{Number.parseFloat(data.bigBrokenInKg * 4/3).toFixed(3)}</TableRowColumn>
          </TableRow>
          <TableRow>
            <TableRowColumn style={{fontSize: '20px'}}>SMALL BROKEN</TableRowColumn>
            <TableRowColumn style={{textAlign: 'right', fontSize: '20px'}}>{data.smallBrokenInKg}</TableRowColumn>
            <TableRowColumn style={{textAlign: 'right', fontSize: '20px'}}>{Number.parseFloat(data.smallBrokenInKg * 4/3).toFixed(3)}</TableRowColumn>
          </TableRow>
          <TableRow>
            <TableRowColumn style={{fontSize: '20px'}}>CHAKI</TableRowColumn>
            <TableRowColumn style={{textAlign: 'right', fontSize: '20px'}}>{data.chakiInKg}</TableRowColumn>
            <TableRowColumn style={{textAlign: 'right', fontSize: '20px'}}>{Number.parseFloat(data.chakiInKg * 4/3).toFixed(3)}</TableRowColumn>
          </TableRow>
          <TableRow>
            <TableRowColumn style={{fontSize: '20px'}}>HEAD RICE</TableRowColumn>
            <TableRowColumn style={{textAlign: 'right', fontSize: '20px'}}>{data.headRiceInKg}</TableRowColumn>
            <TableRowColumn style={{textAlign: 'right', fontSize: '20px'}}>{Number.parseFloat(data.headRiceInKg * 4/3).toFixed(3)}</TableRowColumn>
          </TableRow>
          <TableRow>
            <TableRowColumn style={{fontSize: '20px'}}>TOTAL</TableRowColumn>
            <TableRowColumn style={{textAlign: 'right', fontSize: '20px'}}>{data.riceInKg}</TableRowColumn>
            <TableRowColumn style={{textAlign: 'right', fontSize: '20px'}}>{Number.parseFloat(data.riceInKg * 4/3).toFixed(3)}</TableRowColumn>
          </TableRow>
        </TableBody>
      </Table>
      );
  }

  renderMoistureOptions() {
    const moistureData = Moisture;
    const moistureForGivenVariety = Moisture[this.state.variety];
    const menuItemArray = [];
    let firstItemValue = this.state.moisture;

    Object.keys(moistureForGivenVariety).forEach( (varietyKey,idx) => {
      menuItemArray.push(<MenuItem key={varietyKey} value={varietyKey} primaryText={`${varietyKey}`} />);
      if( idx === 0) {
        firstItemValue = varietyKey;
      }

    });


    return(
      <SelectField
        floatingLabelText='Moisture %'
        value={this.state.moisture || firstItemValue}
        onChange={this.handleMoistureChange.bind(this,'moisture')}
        className='select-field'
      >
      { menuItemArray }
      </SelectField>
    );
  }

}
