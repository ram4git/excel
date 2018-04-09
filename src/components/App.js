import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Navbar from './Navbar'
import Loading from './Loading'
import DynamicImport from './DynamicImport'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';


const Home = (props) => (
  <DynamicImport load={() => import('./Home')}>
    {(Component) => Component === null
      ? <Loading />
      : <Component {...props} />}
  </DynamicImport>
)

const BrokenCalculation = (props) => (
  <DynamicImport load={() => import('./BrokenCalculation')}>
    {(Component) => Component === null
      ? <Loading />
      : <Component {...props} />}
  </DynamicImport>
)

const Settings = (props) => (
  <DynamicImport load={() => import('./Settings')}>
    {(Component) => Component === null
      ? <Loading />
      : <Component {...props} />}
  </DynamicImport>
)

const Request = (props) => (
  <DynamicImport load={() => import('./Request')}>
    {(Component) => Component === null
      ? <Loading />
      : <Component {...props} />}
  </DynamicImport>
)

const Articles = (props) => (
  <DynamicImport load={() => import('./Articles')}>
    {(Component) => Component === null
      ? <Loading />
      : <Component {...props} />}
  </DynamicImport>
)

class App extends Component {
  render() {
    return (
      <MuiThemeProvider>
        <Router basename={'/'}>
          <div>
            <Navbar />

            <Switch>
              <Route path='/' exact component={Home} />
              <Route path='/broken' component={BrokenCalculation} />
              <Route path='/settings' component={Settings} />
              <Route path='/request/:id' exact component={Request} />
              <Route render={() => <h1 className='text-center'>Four oh Four.</h1>} />
            </Switch>
          </div>
        </Router>
      </MuiThemeProvider>
    )
  }
}

export default App
