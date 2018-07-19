import React from'react';
import './style.css';
class ViewApp extends React.Component{

    constructor(props){
        super(props);
        this.state={
            dataView : []
        };
        this.getDataView = this.getDataView.bind(this);
        this.getNextPatch = this.getNextPatch.bind(this);
    }


    componentWillMount(){
        fetch('http://localhost:3001/users')
            .then((response)=> {
                response.json().then((data)=> {
                    this.setState({
                        dataView :data
                    });
                });
            });
    }

    getNextPatch(sn){
        return sn+"5";
    }

    getDataView(){
        let listData = this.state.dataView;
        if(listData.length==0){
            return <table></table>;
        }
        else{
           /*listData = [{
               id:1,
               ProjectName:"test1",
               ServerName:"test2",
               IpAddress:"test3",
               Environment:"test4",
               DataCentre:"test5"
           }];*/
            const listItems = listData.map((data) =>
                <tr key={data.id}>
                    <td>{data.ProjectName}</td>
                    <td>{data.ServerName}</td>
                    <td>{data.IpAddress}</td>
                    <td>{data.DataCentre}</td>
                    <td>{this.getNextPatch(data.ServerName)}</td>
                </tr>
            );
            const listHead = ["ProjectName","ServerName","IpAddress","DataCentre","NextPatch"];
            const headItems =listHead.map((data) =>
                <td>{data}</td>
            );
            return <table className="table table-striped table-hover"><thead><tr>{headItems}</tr></thead><tbody>{listItems}</tbody></table>;
        }
    }

    render(){
        return <div className="section-data">{this.getDataView()}</div>;
    }
}

export default ViewApp;