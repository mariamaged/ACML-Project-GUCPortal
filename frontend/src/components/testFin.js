import React, { Component } from "react";
import ReactDOM from "react-dom";
import BootstrapTable from "react-bootstrap-table-next";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "./styles.css";
import { Button } from "react-bootstrap";

const products = [
  { id: 1, name: "Item 1", price: 100 },
  { id: 2, name: "Item 2", price: 102 }
];

class App extends Component {
  constructor() {
    super();
    this.state = {
      // For displaying data
      columns: [
        {
          dataField: "id",
          text: "id",
          sort: true
        },
        {
          dataField: "name",
          text: "Name",
          sort: true
        },
        {
          dataField: "price",
          text: "Product Price"
        },
        {
          dataField: "follow",
          text: "Follow",
          formatter: this.linkFollow,
          sort: true
        }
      ],
      isFollow: true
    };

    this.onFollowChanged.bind(this);
  }

  onFollowChanged() {
    this.setState({ isFollow: !this.state.isFollow });
    console.log(this.state.isFollow);
  }

  linkFollow = (cell, row, rowIndex, formatExtraData) => {
    return (
      <Button
        onClick={() => {
          this.onFollowChanged(row);
        }}
      >
        Follow
      </Button>
    );
  };

  render() {
    return (
      <div style={{ padding: "20px" }}>
        <h1 className="h2">Products</h1>
        <BootstrapTable
          keyField="id"
          data={products}
          columns={this.state.columns}
        />
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
