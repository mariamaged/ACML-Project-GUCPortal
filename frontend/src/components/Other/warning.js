// Our Components
// React Components
// React
import React from 'react';

// Reacter Router and axios
// CSS and images.
import '../../css/warning.css';

const warning = ({ warning }) => {
    return (
        <div style={{ marginTop: "50px", marginLeft: "100px" }}>
            <div className="alert alert-dismissible alert-primary centerAlert" style={{ height: "200px"}}>
                <button type="button" class="close" data-dismiss="alert" >&times;</button>
                <div>
                    <h4 className="alert-heading">Warning!</h4>
                    <p className="mb-0">{warning}</p>
                </div>
            </div>
        </div>
    )
}

export default warning;

