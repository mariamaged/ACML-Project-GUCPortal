// Our Components
// React Components
import Spinner from 'react-bootstrap/Spinner';
// React
import React from 'react';

// Reacter Router and axios
// CSS and images.
import '../../css/loading.css';
import GUC from '../../GUC.png';

const loading = ({ role }) => {
    return (<div>
        <div style={{ float: "left" }}>
            <h3>
                Loading &nbsp; <small className="text-muted">{role}</small>
            </h3>
        </div>

        <div id="rightSpinner">
            &nbsp;
            <Spinner animation="border" id="spinner" />
            <img src={GUC} alt="GUCimage" width="30px" height="30px" />
        </div>

    </div>
    );
}

export default loading;

