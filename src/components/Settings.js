import React, { Component } from 'react'
import { Route, Link } from 'react-router-dom'
import Sidebar from './Sidebar'
import { processBrokenData } from '../api'
import TeamLogo from './TeamLogo'
import Team from './Team'
import Loading from './Loading'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import { Statistic, Message } from 'semantic-ui-react'


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
       paddyInTons: 193,
       moisture: MOISTURE_START_INDEX,
       rejectedIn36Secs: 3.8,
       smallBroken: 5,
       bigBroken: 10,
       chaki: 1,
       pricePerKg: 20,
    };
  }


  handleMoistureChange = (event, index, value) => this.setState({moisture: value});

  onFieldChange(e, newValue) {
    const inputName = e.target.name;
    const newValueNumber = Number.parseFloat(newValue);
    if (Number.isNaN(newValueNumber && newValue !== '')) {
      this.setState({
        errorMsg: `Invalid number "${newValue}" entered for ${inputName}`
      })
    } else {
      this.setState({
        [inputName]: newValue,
        errorMsg: ''
      });
    }
  }

  on100KgPriceChange(e, newValue) {
    const pricePerKg = newValue ? Number.parseFloat(newValue/100) : 0;
    this.setState({
      pricePerKg
    });

  }

  on75KgPriceChange(e, newValue) {
    const pricePerKg = newValue ? Number.parseFloat(newValue/75) : 0;
    this.setState({
      pricePerKg
    });
  }

  render () {
    const { loading } = this.state


    return (
      <div className='container'>
        <h1 className='small-header'>
          Broken Calculation
        </h1>
        { this.renderErrorMsg() }
        { this.renderSettings() }
        { this.renderStats() }
        { this.renderWeights() }
      </div>
    )
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

  renderFinalStats() {
    const { rejectedInKg = '0.0' } = processBrokenData(this.state);
    const { pricePerKg, moisture } = this.state;
    const pricePerKgAt14PcMoisture = pricePerKg * (100-14)/(100-moisture);
    return (
      <div>
        <Statistic.Group widths='three'>
          <Statistic>
            <Statistic.Value>{`${rejectedInKg} KGs`} </Statistic.Value>
            <Statistic.Label>Rejected In KGs</Statistic.Label>
          </Statistic>
          <Statistic>
            <Statistic.Value>{`₹ ${Number.parseFloat(pricePerKgAt14PcMoisture * 75).toFixed(2)}`}</Statistic.Value>
            <Statistic.Label>Price @ 14% moisture - 75KG</Statistic.Label>
          </Statistic>
          <Statistic>
            <Statistic.Value>{`₹ ${Number.parseFloat(pricePerKgAt14PcMoisture * 100).toFixed(2)}`}</Statistic.Value>
            <Statistic.Label>Price @ 14% moisture - 100KG</Statistic.Label>
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
          { this.renderMoistureOptions() }
          <br />
          <TextField
            hintText='1400'
            floatingLabelText='Price/75KG'
            errorText={`not required if 100KG price is entered`}
            errorStyle={{color: '#7f8c8d'}}
            onChange={ this.on75KgPriceChange.bind(this) }
            name='pricePer75'
            value={ this.state.pricePerKg * 75}
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
            hintText='2100'
            floatingLabelText='Price/100KG'
            errorText={`not required if 75KG price is entered`}
            errorStyle={{color: '#7f8c8d'}}
            onChange={ this.on100KgPriceChange.bind(this) }
            name='pricePer100'
            value={ this.state.pricePerKg * 100}
          /><br />
        </div>
      </div>

    );
  }

  renderSettings() {
    return (
      <Card className='card'>
        <CardTitle title="Input Numbers"  className='cartTitle'/>
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
            <TableRowColumn style={{fontSize: '20px'}}>RICE</TableRowColumn>
            <TableRowColumn style={{textAlign: 'right', fontSize: '20px'}}>{data.riceInKg}</TableRowColumn>
            <TableRowColumn style={{textAlign: 'right', fontSize: '20px'}}>{Number.parseFloat(data.riceInKg * 4/3).toFixed(3)}</TableRowColumn>
          </TableRow>
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
        </TableBody>
      </Table>
      );
  }

  renderMoistureOptions() {
    const menuItemArray = [];
    for( let i = MOISTURE_START_INDEX; i <= MOISTURE_END_INDEX; i++) {
      menuItemArray.push(<MenuItem key={i} value={i} primaryText={`${i}`} />);
    }

    return(
      <SelectField
        floatingLabelText='Moisture %'
        value={this.state.moisture}

        onChange={this.handleMoistureChange}
        className='select-field'
      >
      { menuItemArray }
      </SelectField>
    );
  }

  render
}
