import './App.css';
import { Component } from 'react';
import Navbar from './component/Navbar';
import Panel from './component/Panel';

class App extends Component {
  render() {
    return(
      <div>
        <Navbar/>
        <Panel/>
      </div>
    );
  }
}

export default App;
