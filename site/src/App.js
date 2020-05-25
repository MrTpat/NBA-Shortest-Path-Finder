import React, { Component } from 'react';
import './App.css';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import ListGroup from 'react-bootstrap/ListGroup'
import playerProfs from './res/plyrtoinfo.json'
import Autocomplete from '@material-ui/lab/Autocomplete'
import TextField from '@material-ui/core/TextField'
import { createFilterOptions } from '@material-ui/lab/Autocomplete';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { p1: playerProfs[0], p2: playerProfs[1], link: [], loading: false };
    this.handleChange1 = this.handleChange1.bind(this);
    this.handleChange2 = this.handleChange2.bind(this);
    this.sendreq = this.sendreq.bind(this);
    this.setVal1 = this.setVal1.bind(this);
    this.setVal2 = this.setVal2.bind(this);
  }
  handleChange1(event) {
    console.log(playerProfs["Harold Fox"])
    this.setState({ p1: event.target.value, p2: this.state.p2, link: this.state.link });
  }
  handleChange2(event) {
    this.setState({ p1: this.state.p1, p2: event.target.value, link: this.state.link });
  }
  setVal1(val) {
    this.setState({p1: val})
  }
  setVal2(val) {
    this.setState({p2: val})
  }
  sendreq(e) {
    this.setState({loading: true})
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({p1: this.state.p1["prof"], p2: this.state.p2["prof"]})
    };
    fetch('https://intense-sierra-04960.herokuapp.com/find_path', requestOptions)
      .then(response => response.json())
      .then((data) => {
        this.setState({ link: data.path, loading: false })
      }
      );
  }

  ComboBox1() {
    const filterOptions = createFilterOptions({
      limit: 10
    });
    return (
      <Autocomplete
        className="playerSearch"
        id="combo-box-demo"
        options={playerProfs}
        value={this.state.p1}
        onChange={(event, newValue) => {
          this.setVal1(newValue);
        }}
        getOptionLabel={(option) => option.name + ' [' + option.from + ', ' + option.to + ']'}
        style={{ flex:  1}}
        filterOptions={filterOptions}
        renderInput={(params) => <TextField {...params} label="Select player!" variant="outlined"/>}
      />
    );
  }
  ComboBox2() {
    const filterOptions = createFilterOptions({
      limit: 10
    });
    return (
      <Autocomplete
        className="playerSearch"
        id="combo-box-demo"
        options={playerProfs}
        value={this.state.p2}
        onChange={(event, newValue) => {
          this.setVal2(newValue);
        }}
        getOptionLabel={(option) => option.name + ' [' + option.from + ', ' + option.to + ']'}
        style={{ flex:  1}}
        filterOptions={filterOptions}
        renderInput={(params) => <TextField {...params} label="Select player!" variant="outlined"/>}
      />
    );
  }
  

  render() {
    return (
      <div>
        
        <div className="App">
          <h1>Find the shortest path between NBA Players!</h1>
        </div>
        <div className="inputs">
          <Form>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Enter 1st player's Basketball reference link (following the format provided)</Form.Label>
              {this.ComboBox1()}
            </Form.Group>
            <Form.Group controlId="formBasicPassword">
              <Form.Label>Enter 2nd player's Basketball reference link (following the format provided)</Form.Label>
              {this.ComboBox2()}
              </Form.Group>
            <Button variant="primary" onClick={this.sendreq}>
              Submit
  </Button>
  {this.state.loading &&
                <h1>
                  LOADING
                </h1>
              }
          </Form>
        </div>
        <div>
          <ListGroup>
            {this.state.link.map((value, index) => {
              return <ListGroup.Item>{value}</ListGroup.Item>
            })}
          </ListGroup>
        </div>
      </div>
    );
  }
}

export default App;
