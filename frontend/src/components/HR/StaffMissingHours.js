/* eslint-disable */
import React, { useState, Component } from 'react'
import axios from 'axios'
class StaffMissingHours extends Component {
    state = {
        profiles: []
    }

    componentDidMount() {
        axios.get('http://localhost:5000/HR/viewMissinghours',
            {
                headers: {
                    'x-auth-token': localStorage.getItem('auth-token')
                }
            }
        ).then(res => {
            console.log(res.data);
            this.setState({ profiles: res.data })

        }).catch(console.log("error"))
    }

    handleClick(e, value) {
        e.preventDefault();
        console.log("in click " + value)
    }

    renderprofile = (profile, index) => {
        return (

            <tr key={profile.id} className="reqTr">
                <td className="reqTd" >{profile.name}</td>
                <td className="reqTd" >{profile.id}</td>
                <td className="reqTd">{profile.email}</td>
                <td className="reqTd">{profile.missing_hours}</td>
                <td className="reqTd">{profile.missing_minutes}</td>
            </tr>

        )
    }

    render() {
        const reqs = this.state.profiles;
        console.log(reqs);
        return (
            <div> <table className="table table-hover">
                <thead>
                    <tr>
                        <th scope="col">name</th>
                        <th scope="col">id</th>
                        <th scope="col">email</th>
                        <th scope="col">missing hours</th>
                        <th scope="col">missing minutes</th>
                    </tr>
                </thead>
                <tbody className="reqBody">
                    {reqs.map(this.renderprofile)}
                </tbody>
            </table>
            </div>
        )
    }

}
export default StaffMissingHours;