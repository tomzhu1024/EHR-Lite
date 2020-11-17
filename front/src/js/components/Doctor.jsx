import React, { Component } from 'react';
import style from "../doctor.module.scss";
import { Table } from 'react-bootstrap';
import { InputGroup } from 'react-bootstrap';
import { FormControl } from 'react-bootstrap';

class Counter extends Component {
    state = {
        count : 15
    };
    render() {
        return (
        <React.Fragment>
            
            <div className={style["queue-state-box"]}>
            <p>No.{this.formatCount()}</p>
            </div>

            <div className={style["box"]}>
                <Table striped bordered hover size="sm">
                <thead>
                    <tr>
                    <th>Start Time</th>
                    <th>Allergens</th>
                    <th>Caution</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                    <td>2018-02</td>
                    <td>Beans</td>
                    <td>Can't eat beans</td>
                    </tr>
                    <tr>
                    <td>2020-06</td>
                    <td>Lactose</td>
                    <td>Can't drink milk</td>
                    </tr>
                </tbody>
                </Table>
            </div>

        
            <div className={style["box"]}>
                <Table striped bordered hover size="sm">
                <thead>
                    <tr>
                    <th>Diagnosis Lists</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                    <td>Can't eat beans really can't eat</td>
                    </tr>
                    <tr>
                    <td>Can't drink milk definitely can't drink</td>
                    </tr>
                </tbody>
                </Table>
            </div>
            <div className={style["box"]}>
                <Table striped bordered hover size="sm">
                <thead>
                    <tr>
                    <th>Durgs You Need</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                    <td>Drug1</td>
                    </tr>
                    <tr>
                    <td>Drug2</td>
                    </tr>
                </tbody>
                </Table>
            </div>

            <InputGroup size="sm" className={style["type1"]}>
                <InputGroup.Prepend>
                    <InputGroup.Text id="inputGroup-sizing-sm">Fast-Type</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
            </InputGroup>

            <InputGroup size="sm" className={style["type2"]}>
                <InputGroup.Prepend>
                    <InputGroup.Text id="inputGroup-sizing-sm">Fast-Type</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
            </InputGroup>
            
        </React.Fragment>);
    }
    getBadgeClasses() {
        let classes = "badge m-2 badge-";
        classes += this.state.count === 0 ? "warning" : "primary";
        return classes;
    }

    formatCount() {
        const {count} = this.state;
        return count === 0 ? "Zero" : count;
    }
}
 
export default Counter;