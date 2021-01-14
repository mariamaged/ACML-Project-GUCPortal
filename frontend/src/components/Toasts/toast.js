// Our Components
// React Components
import { toast } from 'react-toastify';

// React
import React, { Component } from 'react';

// Reacter Router and axios
import axios from 'axios';

// CSS and images

class toastComponent extends Component {
    state = {
        toast: false
    }

    componentDidUpdate(prevState) {
        if (prevState.toast !== this.state.toast) {
            axios.get('http://localhost:5000/academic/newNotifications', {
                headers: {
                    'x-auth-token': localStorage.getItem("auth-token")
                }
            })
                .then(response => {
                    console.log(response.data);
                    toast.success(response.data.toString(), {
                        position: "bottom-left",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                    console.log(this.state)
                })

                .catch(error => {
                    console.log('Error with getting new notifications');
                    console.log(error);
                });
        }
    }
    render() {
        setTimeout(() => {
            if (this.state.toast) this.setState({ toast: false })
            else this.setState({ toast: true })
        }, 5000);
        
        return (
            <div>
                AAA
            </div>
        )
    }
}

export default toastComponent;



