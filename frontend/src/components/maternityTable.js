import React,{Component} from 'react'
import axios from 'axios'
import { Button, Table } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown'
// import '../css/test44.css'
// import '../css/bootstrap.min.css'
import DropdownButton from 'react-bootstrap/DropdownButton'
// import Dropdown from 'react-bootstrap/Dropdown'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import history from '../history';
import {Link,NavLink} from 'react-router-dom'
import  { Redirect } from 'react-router-dom'
import { CheckCircle, XCircle } from 'react-bootstrap-icons';


class maternityTable extends Component{
    render(){
        return (
  <div className="containAll">

<div className="containDrop">

   <Dropdown as={ButtonGroup} className="buttons1">
   <Dropdown.Toggle id="dropdown-custom-1"  >State</Dropdown.Toggle>
   <Dropdown.Menu className="drop1">
   <Dropdown.Item ><Link to="/ViewAcceptedMaternityRequests">Accepted</Link></Dropdown.Item>
   <Dropdown.Item><Link to="/ViewRejectedMaternityRequests">Rejected</Link></Dropdown.Item>
   <Dropdown.Item ><Link to="/ViewPendingMaternityRequests">Pending</Link></Dropdown.Item>

   
   <Dropdown.Divider />
   </Dropdown.Menu>
</Dropdown>{' '}
<Dropdown as={ButtonGroup}className="buttons2" >
<Dropdown.Toggle id="dropdown-custom-2" >R/S</Dropdown.Toggle>
   <Dropdown.Menu className="drop2"></Dropdown.Menu>
   <Dropdown.Menu className="super-colors">
   <Dropdown.Item eventKey="1">Sent</Dropdown.Item>
   <Dropdown.Item eventKey="2">Received</Dropdown.Item>

   <Dropdown.Divider />
   <Dropdown.Item eventKey="4" >Separated link</Dropdown.Item>
   </Dropdown.Menu>
</Dropdown>

</div> 



<div className="container containSickTable">
<Table striped bordered hover size="sm" className="reqTable">
<thead className="reqHead">
   <tr className="reqTr">
   <th className="reqTh">#</th>
   <th className="reqTh">Request ID</th>
   <th className="reqTh">Request Type</th>
   <th className="reqTh">Sender</th>
   <th className="reqTh">Receiver</th>
   <th className="reqTh">State</th>
   <th className="reqTh">Maternity Documents</th>
   <th className="reqTh">Reason</th>
   <th className="reqTh">Submission Date</th>
   <th className="reqTh">Response</th>
   </tr>
</thead>
<tbody className="reqBody">

</tbody>
</Table>
</div>
</div>


)
    }
}
export default maternityTable