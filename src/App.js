import React, {Component} from 'react';
import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import Add from './components/add/app';
import View from './components/view/app';

class App extends Component {
    constructor(props){
        super(props);
        this.state = {
            username : "undefined",
            role : "undefined",
            menu : "view"
        };
        this.setMenu = this.setMenu.bind(this);
        this.getMenu = this.getMenu.bind(this);
    }

    getMenu(menu){
        switch (menu)
        {
            case "add" :
                return <Add/>;
            case "view" :
                return <View/>;
        }
        return "This area is not available.";
    }

    setMenu(menu)
    {
        this.setState({
            menu : menu
        });
    }

    componentWillMount(){
        this.setState({
            username : "Kittinun Pongsukjai",
            role : "Planner"
        });
    }

    render() {
        return (
            <div className="content">
                <div className="tr-background">
                    <span className="head-label">POD Patching  </span>
                    <button onClick={()=>{this.setMenu("view")}} className='btn btn-outline-warning'>View</button>&nbsp;
                    {this.state.role=="Planner"?<button onClick={()=>{this.setMenu("add")}} className="btn btn-outline-warning">Manage</button>:""}
                    <button className="btn btn-outline-warning float-right">{this.state.username} ( {this.state.role} )</button>
                </div>
                <div className="menu-content">
                    {this.getMenu(this.state.menu)}
                </div>

            </div>
        );
    }
}

export default App;
