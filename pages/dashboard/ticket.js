import Main_Layout from "../../components/layout/main_layout";
import React, {Component,useEffect, useState} from 'react';
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import ls from "local-storage";
import * as Constants from "../../components/config/constant";
import * as Api from "../../components/config/api";
import * as Session from "../../components/config/session";
import Countdown from "react-countdown";
import NProgress from "nprogress";
import Swal from "sweetalert2";
import Link from "next/link";
import activityContext from "../../components/config/context";
import firebase from "firebase";
import moment from "moment";
import Dashboard_Layout from "../../components/layout/dashboard_layout";



export default class Ticket extends Component {
    static contextType = activityContext;
    constructor(props) {
        super(props);
        this.state = {
            loading : false,
            data: [],
            message : [],
            messages : [],
            pictures: [],
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleUpload = this.handleUpload.bind(this);
    }


    handleChange(e) {
        if(e.target.name === 'text') {
            this.setState({...this.state, message: {...this.state.message, [e.target.name]: e.target.value}});
        }else if(e.target.name === 'myfile')
        {
            this.setState({...this.state, pictures: {...this.state.pictures, [e.target.name]: e.target.files}});

        }
    }

    handleUpload(e) {
        e.preventDefault();


        try {
            NProgress.start();
            NProgress.inc();
            NProgress.configure({ ease: 'ease', speed: 500 });

            var formdata = new FormData();

            // order.image.forEach(function(details, index) {
            //     formdata.append('image', order.image[index], details.name);
            // });

            formdata.append("image", this.state.pictures.myfile[0], "images.png");

            fetch(Api.uploadFile,
                {
                    method: 'POST',
                    body: formdata,
                    headers: {
                        Authorization: 'Bearer ' + Session.token,
                        'ip' : ls.get('ip'),
                        'device' : ls.get('device'),
                    }
                }).then((res) => res.json())
                .then((responseUpload) => {
                    NProgress.done();
                    Swal.fire({
                        title: 'Success!',
                        text: 'File uploaded',
                        icon: 'success',
                    })


                        let sender, userId, email, subject, message, url,notificationMessage;

                        if(Session.role !== 'regular')
                        {
                            sender = 'admin';
                            userId = this.state.data.userId;
                            email = this.state.data.email;
                            subject = 'New Ticket Reply';
                            message = '<p>Dear '+this.state.data.username+'</p><p>An administrator has just replied your ticket regarding <b>'+this.state.data.subject+'</b>.' +
                                'Click <a href="https://valorexchange.com/dashboard/support">here</a> to view this ticket.</p>';
                            notificationMessage = 'An administrator has just replied your ticket regarding '+this.state.data.subject;
                            url = "https://valorexchange.com/dashboard/support";
                        }else {
                            sender = 'user';
                            userId = 'admin';
                            email = 'info@valorexchange.com';
                            subject = 'New Ticket Reply';
                            message = '<p>Dear Admin</p><p>A user has just replied to a ticket regarding <b>'+this.state.data.subject+'</b>.' +
                                'Click <a href="https://valorexchange.com/admin/support">here</a> to view this ticket.</p>';
                            notificationMessage = 'A user has just replied to a ticket regarding '+this.state.data.subject;
                            url = "https://valorexchange.com/admin/support";
                        }

                        const data = {
                            message : responseUpload.data.image,
                            sender : sender,
                            type: 'file',
                            imageId: responseUpload.data.imageId,
                            username : Session.username,
                            date : Date.now()
                        }

                        let messageRef = firebase.database().ref(this.state.data.ticketToken);
                        messageRef.push(data);
                        this.setState({...this.state, message: {...this.state.message, ['text']: '' } });

                        fetch(Api.reopenTicket + '/' + this.state.data._id,
                            {
                                method: 'PUT',
                                headers: {
                                    Authorization: 'Bearer ' + Session.token
                                }
                            }).then((res) => res.json())
                            .then((response26) => {
                                console.log(response26);
                                this.fetchTicket()
                            });

                        let notify = {
                            userId : userId,
                            email: email,
                            subject: subject,
                            message : message,
                            url : url,
                            notificationMessage : notificationMessage
                        }

                        fetch(Api.sendNotification,
                            {
                                method: 'POST',
                                body : JSON.stringify(notify),
                                headers: {
                                    Authorization: 'Bearer ' + Session.token,
                                    'Content-type': 'application/json',
                                    'ip' : ls.get('ip'),
                                    'device' : ls.get('device'),
                                }
                            }).then((res) => res.json())
                            .then((response265) => {
                                console.log(response265);
                                this.fetchTicket()
                            })


                        this.fetchFirebaseData();



                    console.log(responseUpload);

                });

        } catch (e) {
            NProgress.done();
            console.log('An error occurred', e);
            Swal.fire({
                title: 'Error!',
                text: e.message,
                icon: 'error',
                confirmButtonText: 'Ok'
            });

        }
    };

    handleSubmit(e) {
        e.preventDefault();

        try {

            let username, sender, userId, email, subject, message, url,notificationMessage;

            if(Session.role !== 'regular')
            {
                sender = 'admin';
                userId = this.state.data.userId;
                email = this.state.data.email;
                subject = 'New Ticket Reply';
                message = '<p>Dear '+this.state.data.username+'</p><p>An administrator has just replied your ticket regarding <b>'+this.state.data.subject+'</b>.' +
                    'Click <a href="https://valorexchange.com/dashboard/support">here</a> to view this ticket.</p>';
                notificationMessage = 'An administrator has just replied your ticket regarding '+this.state.data.subject;
                url = "https://valorexchange.com/dashboard/support";
            }else {
                sender = 'user';
                userId = 'admin';
                email = 'info@valorexchange.com';
                subject = 'New Ticket Reply';
                message = '<p>Dear Admin</p><p>A user has just replied to a ticket regarding <b>'+this.state.data.subject+'</b>.' +
                    'Click <a href="https://valorexchange.com/admin/support">here</a> to view this ticket.</p>';
                notificationMessage = 'A user has just replied to a ticket regarding '+this.state.data.subject;
                url = "https://valorexchange.com/admin/support";
            }

            const data = {
                message : this.state.message.text,
                sender : sender,
                type: 'message',
                username : Session.username,
                date : Date.now()
            }

            let messageRef = firebase.database().ref(this.state.data.ticketToken);
            messageRef.push(data);
            this.setState({...this.state, message: {...this.state.message, ['text']: '' } });

            fetch(Api.reopenTicket + '/' + this.state.data._id,
                {
                    method: 'PUT',
                    headers: {
                        Authorization: 'Bearer ' + Session.token
                    }
                }).then((res) => res.json())
                .then((response26) => {
                    console.log(response26);
                    this.fetchTicket()
                });

            let notify = {
                userId : userId,
                email: email,
                subject: subject,
                message : message,
                url : url,
                notificationMessage : notificationMessage
            }

            fetch(Api.sendNotification,
                {
                    method: 'POST',
                    body : JSON.stringify(notify),
                    headers: {
                        Authorization: 'Bearer ' + Session.token,
                        'Content-type': 'application/json',
                        'ip' : ls.get('ip'),
                        'device' : ls.get('device'),
                    }
                }).then((res) => res.json())
                .then((response265) => {
                    console.log(response265);
                    this.fetchTicket()
                })


            this.fetchFirebaseData();


        } catch (e) {
            NProgress.done();
            console.log('An error occurred', e);
            Swal.fire({
                title: 'Error!',
                text: 'An error occurred while submitting the form',
                icon: 'error',
                confirmButtonText: 'Ok'
            });

        }
    };

    fetchTicket()
    {

        //console.log(this.props.data._id);
        fetch(Api.fetchSingleTickets + '/' + this.state.data._id,
            {
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + Session.token
                }
            }).then((res) => res.json())
            .then((response26) => {
                //console.log(response26);
                if (response26.data !== undefined) {
                    this.setState({data : response26.data});
                  //  console.log(response26.data);
                }
            })
    }

    closeTicket()
    {
        NProgress.start();
        NProgress.inc();
        NProgress.configure({ ease: 'ease', speed: 500 });

        fetch(Api.createTicket + '/' + this.state.data._id,
            {
                method: 'PUT',
                headers: {
                    Authorization: 'Bearer ' + Session.token
                }
            }).then((res) => res.json())
            .then((response261) => {
                NProgress.done();
                //console.log(response261);

                if (response261.status === 'successful') {
                    this.fetchTicket();
                    // console.log(this.props.data.data);

                }
            })
    }

    fetchFirebaseData()
    {

        const messageRef = firebase.database().ref(this.props.data.ticketToken);
        messageRef.on('value', (snapshot) => {
            const messages = snapshot.val();
            const messageList = [];

            for(let id in messages)
            {
                messageList.push(messages[id]);
            }
            //console.log(messageList);
            this.setState({messages : messageList.reverse()});
        })
    }

    initializeFirebase()
    {

        const config = {
            apiKey: "AIzaSyAoVCmfERUlyiZHhXnidiIbfxXuGZsT25Y",
            authDomain: "valor-7dadf.firebaseapp.com",
            projectId: "valor-7dadf",
            storageBucket: "valor-7dadf.appspot.com",
            messagingSenderId: "598126901194",
            databaseURL: "https://valor-7dadf-default-rtdb.firebaseio.com",
            appId: "1:598126901194:web:043132bee82ef213720133"
        };

        if( firebase.apps.length === 0 ){
            firebase.initializeApp(config);
        }
        this.setState({loading : false});
    }


    componentDidMount() {

        Session.validateUser();

        this.setState({data : this.props.data});

        this.initializeFirebase();

        this.fetchFirebaseData();

        console.log(this.props.data);


    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.data !== this.props.data)
        {
            this.setState({loading : true});
            this.setState({data : this.props.data});
            this.fetchTicket();
        }
    }


    render(){
        this.fetchTicket();
        return (
            <div>
                { this.state.loading ? (
                    <Constants.loading />
                ) : (

                    <section className="">
                        <div className="bg-dark sticky-top border_bottom p-3">
                            <h5 className="m-0 font-white">Support Ticket</h5>
                        </div>
                        <div className="p-3 reconcile ">



                                <div id="reconcile_body" className="border_bottom">
                                    {
                                        Session.role !== 'regular' ? (
                                            <div className="border p-3 border_radius mb-2 shadow-sm">
                                                <div className="border_bottom">
                                                    <Link href={'/admin/view_user?us=' + this.state.data.userId}>
                                                        <a className="btn btn-sm btn-warning float-end">View Profile</a>
                                                    </Link>
                                                    <h4 className="m-0 text-capitalize">{this.state.data.username}</h4>
                                                    <p className="font-gray m-0">{this.state.data.email}</p>
                                                </div>
                                                <div className="pt-3">
                                                    {
                                                        this.state.data.status === 'pending' ?(
                                                    <button onClick={() => this.closeTicket()} className="btn btn-danger w-100">Close Ticket</button>
                                                        ):(
                                                            <div className="alert alert-danger text-center">
                                                                This ticket is closed
                                                            </div>
                                                        )
                                                    }
                                                </div>
                                            </div>
                                        ) : (

                                                this.state.data.status === 'pending' ?(
                                                    null
                                                ):(
                                                    <div className="alert alert-danger text-center">
                                                        This ticket is closed. You can still reoly this ticket to re-open it.
                                                    </div>
                                                )

                                        )
                                    }

                            {
                                this.state.messages.map((message,index) =>(

                                    message.sender === 'user' ?(
                                        <div className="mb-1 p-3 border_bottom">
                                            <badge className="badge bg-success font-xs mb-2 font-white">Customer Reply</badge>
                                            <h6 className="font-gray font-xs text-capitalize">{message.username} • {moment(message.date).fromNow()}</h6>
                                            <div className="lead">
                                                {
                                                    message.type === 'message'?(
                                                    message.message
                                                    ):message.type === 'file'?(
                                                        <div className="bg-white clearfix border_radius border p-2">
                                                            <a href={message.message} target="_blank" className="float-end btn-sm btn btn-outline-success">
                                                                <i className="fa fa-file-download"></i> View File
                                                            </a>
                                                            <p className="m-0">File attachment</p>
                                                            <span className="font-xs font-gray">{message.imageId}</span>

                                                        </div>
                                                    ):(null)
                                                }
                                            </div>
                                        </div>
                                    ): message.sender === 'admin' ?(
                                        <div className="mb-1 p-3 bg-ticket-admin">
                                            <badge className="badge bg-danger font-xs mb-2 font-white">Support Desk Response</badge>
                                            <h6 className="font-gray font-xs text-capitalize">{message.username} • {moment(message.date).fromNow()}</h6>
                                            <div className="lead">
                                                {
                                                    message.type === 'message'?(
                                                        message.message
                                                    ):message.type === 'file'?(
                                                        <div className="bg-white clearfix border_radius border p-2">
                                                            <a href={message.message} target="_blank" className="float-end btn-sm btn btn-outline-success">
                                                                <i className="fa fa-file-download"></i> View File
                                                            </a>
                                                            <p className="m-0">File attachment</p>

                                                            <span className="font-xs font-gray">{message.imageId}</span>

                                                        </div>
                                                    ):(null)
                                                }
                                            </div>
                                        </div>
                                    ):(null)

                                ))
                            }
                            </div>

                            <div className="reconcile_message_container p-2">

                                        <form onSubmit={this.handleSubmit}>
                                            <div className="input-group mb-3">
                                                <button className="btn btn-warning" type="button" data-bs-toggle="modal" data-bs-target="#uploadModal"
                                                        id="button-addon1"><i className="fa fa-upload"></i> Upload
                                                </button>
                                                <input type="text" className="form-control" onChange={this.handleChange} value={this.state.message.text} placeholder=""
                                                       name="text"
                                                       placeholder="Enter message and press Enter"/>
                                            </div>

                                        </form>

                            </div>

                        </div>


                        <div className="modal fade" id="uploadModal" data-bs-backdrop="static" data-bs-keyboard="false"
                             tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content">
                                    <div className="modal-header bg-dark">
                                        <h5 className="modal-title font-white" id="staticBackdropLabel">Upload File</h5>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal"
                                                aria-label="Close"></button>
                                    </div>
                                    <div className="modal-body">
                                        <div className=" ">

                                            <div className="bg-skyblue p-3 border border_radius">
                                                {/*<b><i className="fa fa-info-circle"></i> Note</b>*/}
                                                <p className="mb-0">Select the file you will like to upload.</p>
                                            </div>

                                            <form onSubmit={this.handleUpload}>
                                                <div className="mt-4  form-group">
                                                    <input type="file" name="myfile" onChange={this.handleChange} className="form-control"/>
                                                </div>

                                                <button className="btn mt-3 btn-lg btn-warning w-100"><i className="fa fa-upload"></i> Upload</button>
                                            </form>


                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>

                    </section>



                )}
            </div>
        );
    }
}



