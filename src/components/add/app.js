import React from 'react';
import './style.css';
class addApp extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            main : "ci",
            action : "mass-add",
            ci_input_mass_add : [],
            ci_input_mass_add_head : []
        };
        this.setMenu = this.setMenu.bind(this);
        this.getMenu = this.getMenu.bind(this);
        this.setInput = this.setInput.bind(this);
        this.getDataInput = this.getDataInput.bind(this);
        this.addCi = this.addCi.bind(this);
    }

    addCi(){
        let myVar = {head:this.state.ci_input_mass_add_head,row:this.state.ci_input_mass_add};
        fetch('http://localhost:3001/users/add',
            {
                method: 'POST',
                headers: {
                    'Content-Type':'application/x-www-form-urlencoded'
                },
                body: JSON.stringify(myVar)
            })
            .then((response)=> {
                response.text().then((data)=> {
                    console.log(data);
                });
            });
    }

    setMenu(main,act){
        this.setState({
            main : main,
            action : act
        });
    }

    resetData(){
        this.refs.input.value="";
        this.refs.input.focus();
        this.setState({
            ci_input_mass_add :[],
            ci_input_mass_add_head :[]
        });
    }

    setInput(e){
        const input = e.target.value;
        if(input=="")
        {
            this.setState({
                ci_input_mass_add :[],
                ci_input_mass_add_head :[]
            });
            return;
        }

        //console.log(input);

        let input_rows = input.split("\n");

        //check excel header ProjectName	ServerName	IPAddress 	Environment 	DataCentre
        let true_head = ["projectname","servername","ipaddress","environment","datacentre"];
        let data_head =  [];
        let data_body = [];
        let head = input_rows[0];
        let head_cols = head.split("\t");
        if(head_cols.length!=5)
        {
            alert("Invalid input format(Invalid column length).");
            this.refs.input.value = "";
            this.setState({
                ci_input_mass_add :[],
                ci_input_mass_add_head :[]
            });
            return;
        }
        for(let i=0;i<head_cols.length;i++)
        {
            let match = false;
            for(let j=0;j<true_head.length;j++)
            {
               // console.log(head_cols[i].toLowerCase()+" and "+true_head[j]);
                if(head_cols[i].toLowerCase().replace(" ","")==true_head[j])
                {
                    match = true;
                }
            }
            if(match==false)
            {
                alert("Invalid input format("+head_cols[i].toLowerCase()+").");
                this.refs.input.value = "";
                this.setState({
                    ci_input_mass_add :[],
                    ci_input_mass_add_head :[]
                });
                return;
            }
            else
            {
                data_head.push(head_cols[i]);
            }
        }

        // row data eoncode
        for(let i =1;i<input_rows.length-1;i++)
        {
            let data_cols = input_rows[i].split("\t");
            if(data_cols.length!=5)
            {
                alert("Invalid input format(Invalid column length).");
                this.refs.input.value = "";
                this.setState({
                    ci_input_mass_add :[],
                    ci_input_mass_add_head :[]
                });
                return;
            }
            let data_row = "{";
            data_row += '"index":"'+i+'"';
            for(let j=0;j<data_cols.length;j++)
            {
                if(data_row!="{")data_row+=",";
                data_row += '"'+data_head[j]+'":"'+data_cols[j]+'"';
            }
            data_row += "}";
            data_body.push(JSON.parse(data_row));
        }

        this.setState({
            ci_input_mass_add :data_body,
            ci_input_mass_add_head :data_head
        });
    }

    getDataInput(){

        console.log(JSON.stringify(this.state.ci_input_mass_add));
        if(this.state.ci_input_mass_add.length==0||this.state.ci_input_mass_add_head.length==0)
        {
            return <div></div>;
        }
        //console.log("data : "+this.state.ci_input_mass_add);
        const head = this.state.ci_input_mass_add_head;
        const headTable  = <thead><tr>
                                <th>No.</th>
                                <th>{head[0]}</th>
                                <th>{head[1]}</th>
                                <th>{head[2]}</th>
                                <th>{head[3]}</th>
                                <th>{head[4]}</th>
                            </tr></thead>;
        let rows = this.state.ci_input_mass_add;
        const bodyTable = rows.map((row) =>
            <tr>
                <th>{row["index"]}</th>
                <th>{row[head[0]]}</th>
                <th>{row[head[1]]}</th>
                <th>{row[head[2]]}</th>
                <th>{row[head[3]]}</th>
                <th>{row[head[4]]}</th>
            </tr>
        );
        return <div>
            <table className="table table-striped">
                {headTable}
                <tbody>
                {bodyTable}
                </tbody>
            </table>
            <br/>
        </div>;
    }

    getMenu(){
        const main = this.state.main;
        const action = this.state.action;
        if(main=="ci")
        {
            if(action=="mass-add")
            {
                return <div>
                    {action}
                    <div className="row">
                        <div className="col-12">
                            Input (ProjectName	ServerName	IPAddress 	Environment 	DataCentre)
                            <br/>
                            <textarea ref="input" onInput={(e)=>{this.setInput(e)}} rows={10} autoFocus={true}></textarea>
                        </div>
                        <div className="col-12 data-table">
                            {this.getDataInput()}
                        </div>
                        <div className="col-12 add-data">
                            {this.state.ci_input_mass_add.length>0 ?
                                (<div>
                                    <button onClick={this.addCi} className="btn btn-success">Add ({this.state.ci_input_mass_add.length} rows)</button>
                                    &emsp;<button onClick={()=>{this.resetData()}} className="btn btn-info">Clear</button>
                                </div>):""}
                        </div>
                    </div>
                </div>;
            }
            else if(action=="single-add"){
                return <div>
                    {action}
                </div>;
            }
        }
        return <div>Thie section is not available.</div>;
    }

    render(){
        return <div>
            <div className="add-menu">
                <div className="list-group">
                    <a  className="list-group-item bg-warning ">
                        Configuration Item
                    </a>
                    <a onClick={()=>{this.setMenu("ci","single-add")}} className="list-group-item list-group-item-action bg-dark text-warning">&emsp;single add</a>
                    <a onClick={()=>{this.setMenu("ci","mass-add")}} className="list-group-item list-group-item-action bg-dark text-warning">&emsp;mass add</a>
                </div>
            </div>
            &emsp;
            <div className="add-content">
                {this.getMenu()}
            </div>
        </div>;
    }
}

export default addApp;