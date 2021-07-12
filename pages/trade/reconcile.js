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


export default class Reconcile extends Component {
    static contextType = activityContext;
    constructor(props) {
        super(props);
        this.state = {
            loading : true,
            advert : [],
            listAsset : [],
            message : [],
            messages : [],
            pictures : [],
            fire : false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleUpload = this.handleUpload.bind(this);
        this.paymentReceived = this.paymentReceived.bind(this);
        this.coinsReceived = this.coinsReceived.bind(this);
        this.releaseCoin = this.releaseCoin.bind(this);

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


                    if(this.props.data.data.status !== 'closed') {

                        let username, sender, notify, d_message;



                        //console.log(this.state.message.text);

                        if (Session.role !== 'regular') {
                            username = 'Admin';
                            sender = 'admin';
                            notify = [{
                                userId : this.props.data.data.ownerId,
                                email : this.props.data.data.ownerMail,
                                subject : 'New Reconciliation Reply',
                                message : '<p>Dear ' + this.props.data.data.ownerName + '</p><p>An administrator has just replied your reconciliation dispute with <b>' + this.props.data.data.sellerName + '</b>.' +
                                    'Click <a href="https://valorexchange.com/dashboard/reconciliation">here</a> to view this dispute.</p>',
                                notificationMessage : 'An administrator has just replied your reconciliation dispute with ' + this.props.data.data.sellerName,
                                url : "https://valorexchange.com/dashboard/reconciliation"
                            },
                                {
                                    userId : this.props.data.data.selllerId,
                                    email : this.props.data.data.sellerMail,
                                    subject : 'New Reconciliation Reply',
                                    message : '<p>Dear ' + this.props.data.data.sellerName + '</p><p>An administrator has just replied your reconciliation dispute with <b>' + this.props.data.data.ownerName + '</b>.' +
                                        'Click <a href="https://valorexchange.com/dashboard/reconciliation">here</a> to view this dispute.</p>',
                                    notificationMessage : 'An administrator has just replied your reconciliation dispute with ' + this.props.data.data.ownerName,
                                    url : "https://valorexchange.com/dashboard/reconciliation"
                                }
                            ]
                        } else {
                            if (Session.username === this.props.data.data.sellerName) {
                                username = this.props.data.data.sellerName;
                                sender = 'seller';
                                notify = [{
                                    userId : this.props.data.data.ownerId,
                                    email : this.props.data.data.ownerMail,
                                    subject : 'New Reconciliation Reply',
                                    message : '<p>Dear ' + this.props.data.data.ownerName + '</p><p>' + this.props.data.data.sellerName + ' has just replied your reconciliation dispute with them.' +
                                        'Click <a href="https://valorexchange.com/dashboard/reconciliation">here</a> to view this dispute.</p>',
                                    notificationMessage : this.props.data.data.sellerName + ' has just replied your reconciliation dispute with them',
                                    url : "https://valorexchange.com/dashboard/reconciliation"
                                },
                                    {
                                        userId : 'admin',
                                        email : 'info@valorexchange.com',
                                        subject : 'New Reconciliation Reply',
                                        message : '<p>Dear Admin </p><p>A user has just replied to a reconciliation dispute with <b>' + this.props.data.data.ownerName + '</b>.' +
                                            'Click <a href="https://valorexchange.com/admin/reconciliation">here</a> to view this dispute.</p>',
                                        notificationMessage : 'A user has just replied to a reconciliation dispute with ' + this.props.data.data.ownerName,
                                        url : "https://valorexchange.com/admin/reconciliation"
                                    }
                                ]
                            } else {
                                username = this.props.data.data.ownerName;
                                sender = 'buyer';
                                notify = [{
                                    userId : this.props.data.data.sellerId,
                                    email : this.props.data.data.sellerMail,
                                    subject : 'New Reconciliation Reply',
                                    message : '<p>Dear ' + this.props.data.data.sellerName + '</p><p>' + this.props.data.data.ownerName + ' has just replied your reconciliation dispute with them.' +
                                        'Click <a href="https://valorexchange.com/dashboard/reconciliation">here</a> to view this dispute.</p>',
                                    notificationMessage : this.props.data.data.ownerName + ' has just replied your reconciliation dispute with them',
                                    url : "https://valorexchange.com/dashboard/reconciliation"
                                },
                                    {
                                        userId : 'admin',
                                        email : 'info@valorexchange.com',
                                        subject : 'New Reconciliation Reply',
                                        message : '<p>Dear Admin </p><p>A user has just replied to a reconciliation dispute with <b>' + this.props.data.data.sellerName + '</b>.' +
                                            'Click <a href="https://valorexchange.com/admin/reconciliation">here</a> to view this dispute.</p>',
                                        notificationMessage : 'A user has just replied to a reconciliation dispute with ' + this.props.data.data.sellerName,
                                        url : "https://valorexchange.com/admin/reconciliation"
                                    }
                                ]
                            }
                        }

                        const data = {
                            message : responseUpload.data.image,
                            sender : sender,
                            type: 'file',
                            imageId: responseUpload.data.imageId,
                            username : username,
                            date : Date.now()
                        }


                        let messageRef = firebase.database().ref(this.props.data.data.reconcilationToken);
                        messageRef.push(data);
                        this.setState({...this.state, message: {...this.state.message, ['text']: ''}});


                        for(let i in notify) {
                            fetch(Api.sendNotification,
                                {
                                    method: 'POST',
                                    body : JSON.stringify(notify[i]),
                                    headers: {
                                        Authorization: 'Bearer ' + Session.token,
                                        'Content-type': 'application/json',
                                        'ip' : ls.get('ip'),
                                        'device' : ls.get('device'),
                                    }
                                }).then((res) => res.json())
                                .then((response265) => {
                                    console.log(response265);
                                })
                        }
                        this.fetchFirebaseDate();

                    }else{
                        Swal.fire({
                            title: 'Error!',
                            text: 'Dispute already closed',
                            icon: 'error',
                            confirmButtonText: 'Ok'
                        });
                    }


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

    handleSubmit(e,msg = null) {
        e.preventDefault();

        try {

            if(this.props.data.data.status !== 'closed') {

                let username, sender, notify, d_message;

                if(msg !== null)
                {
                    d_message = msg;
                }else{
                    d_message = this.state.message.text;
                }

                //console.log(this.state.message.text);

                if (Session.role !== 'regular') {
                    username = 'Admin';
                    sender = 'admin';
                    notify = [{
                        userId : this.props.data.data.ownerId,
                        email : this.props.data.data.ownerMail,
                        subject : 'New Reconciliation Reply',
                        message : '<p>Dear ' + this.props.data.data.ownerName + '</p><p>An administrator has just replied your reconciliation dispute with <b>' + this.props.data.data.sellerName + '</b>.' +
                        'Click <a href="https://valorexchange.com/dashboard/reconciliation">here</a> to view this dispute.</p>',
                        notificationMessage : 'An administrator has just replied your reconciliation dispute with ' + this.props.data.data.sellerName,
                        url : "https://valorexchange.com/dashboard/reconciliation"
                    },
                        {
                            userId : this.props.data.data.selllerId,
                            email : this.props.data.data.sellerMail,
                            subject : 'New Reconciliation Reply',
                            message : '<p>Dear ' + this.props.data.data.sellerName + '</p><p>An administrator has just replied your reconciliation dispute with <b>' + this.props.data.data.ownerName + '</b>.' +
                                'Click <a href="https://valorexchange.com/dashboard/reconciliation">here</a> to view this dispute.</p>',
                            notificationMessage : 'An administrator has just replied your reconciliation dispute with ' + this.props.data.data.ownerName,
                            url : "https://valorexchange.com/dashboard/reconciliation"
                        }
                    ]
                } else {
                    if (Session.username === this.props.data.data.sellerName) {
                        username = this.props.data.data.sellerName;
                        sender = 'seller';
                        notify = [{
                            userId : this.props.data.data.ownerId,
                            email : this.props.data.data.ownerMail,
                            subject : 'New Reconciliation Reply',
                            message : '<p>Dear ' + this.props.data.data.ownerName + '</p><p>' + this.props.data.data.sellerName + ' has just replied your reconciliation dispute with them.' +
                                'Click <a href="https://valorexchange.com/dashboard/reconciliation">here</a> to view this dispute.</p>',
                            notificationMessage : this.props.data.data.sellerName + ' has just replied your reconciliation dispute with them',
                            url : "https://valorexchange.com/dashboard/reconciliation"
                        },
                            {
                                userId : 'admin',
                                email : 'info@valorexchange.com',
                                subject : 'New Reconciliation Reply',
                                message : '<p>Dear Admin </p><p>A user has just replied to a reconciliation dispute with <b>' + this.props.data.data.ownerName + '</b>.' +
                                    'Click <a href="https://valorexchange.com/admin/reconciliation">here</a> to view this dispute.</p>',
                                notificationMessage : 'A user has just replied to a reconciliation dispute with ' + this.props.data.data.ownerName,
                                url : "https://valorexchange.com/admin/reconciliation"
                            }
                        ]
                    } else {
                        username = this.props.data.data.ownerName;
                        sender = 'buyer';
                        notify = [{
                            userId : this.props.data.data.sellerId,
                            email : this.props.data.data.sellerMail,
                            subject : 'New Reconciliation Reply',
                            message : '<p>Dear ' + this.props.data.data.sellerName + '</p><p>' + this.props.data.data.ownerName + ' has just replied your reconciliation dispute with them.' +
                                'Click <a href="https://valorexchange.com/dashboard/reconciliation">here</a> to view this dispute.</p>',
                            notificationMessage : this.props.data.data.ownerName + ' has just replied your reconciliation dispute with them',
                            url : "https://valorexchange.com/dashboard/reconciliation"
                        },
                            {
                                userId : 'admin',
                                email : 'info@valorexchange.com',
                                subject : 'New Reconciliation Reply',
                                message : '<p>Dear Admin </p><p>A user has just replied to a reconciliation dispute with <b>' + this.props.data.data.sellerName + '</b>.' +
                                    'Click <a href="https://valorexchange.com/admin/reconciliation">here</a> to view this dispute.</p>',
                                notificationMessage : 'A user has just replied to a reconciliation dispute with ' + this.props.data.data.sellerName,
                                url : "https://valorexchange.com/admin/reconciliation"
                            }
                        ]
                    }
                }

                const data = {
                    message: d_message,
                    sender: sender,
                    username: username,
                    type: 'message',
                    date: Date.now()
                }


                    let messageRef = firebase.database().ref(this.props.data.data.reconcilationToken);
                    messageRef.push(data);
                    this.setState({...this.state, message: {...this.state.message, ['text']: ''}});


            for(let i in notify) {
                fetch(Api.sendNotification,
                    {
                        method: 'POST',
                        body : JSON.stringify(notify[i]),
                        headers: {
                            Authorization: 'Bearer ' + Session.token,
                            'Content-type': 'application/json',
                            'ip' : ls.get('ip'),
                            'device' : ls.get('device'),
                        }
                    }).then((res) => res.json())
                    .then((response265) => {
                        console.log(response265);
                    })
            }
                this.fetchFirebaseDate();

            }else{
                Swal.fire({
                    title: 'Error!',
                    text: 'Dispute already closed',
                    icon: 'error',
                    confirmButtonText: 'Ok'
                });
            }

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

    paymentReceived()
    {
        //console.log('payment received');

        let message = "I have received cash payment into my bank account and will end the reconciliation process now. Thank you";

        this.handleSubmit(event,message);

        this.endReconcilation(this.props.data.data._id);

    };

    coinsReceived()
    {
        //console.log('payment received');

        let message = "I have received payment of the designated coins into my wallet and will end the reconciliation process now. Thank you";

        this.handleSubmit(event,message);

        this.endReconcilation(this.props.data.data._id);
    };


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

    fetchAdvert()
    {
        //console.log(this.props.data.data);

        const response26 = fetch(Api.fetchAdvert + '/' + this.props.data.data.advertId,
            {
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + Session.token
                }
            }).then((res) => res.json())
            .then((response26) => {

                if (response26.data !== undefined) {
                    this.setState({advert : response26.data})
                    // console.log(response26.data);

                    let count = Session.assets.length;

                    for(let i = 0; i < count; i++)
                    {
                        let data = Session.assets[i];

                        if (response26.data.asset.toUpperCase() === data.abbr) {
                            this.setState({listAsset : data});
                        }

                    }

                    this.initializeFirebase();

                    this.fetchFirebaseDate();
                }
            })
    }

    fetchReconcilation()
    {

        fetch(Api.fetchSingleReconciliation + '/' + this.props.data.data._id,
            {
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + Session.token
                }
            }).then((res) => res.json())
            .then((response26) => {
               // console.log(response26);
                if (response26.data !== undefined) {
                    this.props.data.data = response26.data;
                     //console.log(response26.data);
                }
            })
    }

    endReconcilation(id)
    {
        NProgress.start();
        NProgress.inc();
        NProgress.configure({ ease: 'ease', speed: 500 });

        fetch(Api.endReconciliation + '/' + id,
            {
                method: 'PUT',
                headers: {
                    Authorization: 'Bearer ' + Session.token
                }
            }).then((res) => res.json())
            .then((response261) => {
                NProgress.done();
                console.log(response261);

                if (response261.status === 'successful') {

                    this.fetchAdvert();
                    this.fetchReconcilation();
                   // console.log(this.props.data.data);

                }
            })
    }


    releaseCoin(receiver, username)
    {
        NProgress.start();
        NProgress.inc();
        NProgress.configure({ ease: 'ease', speed: 500 });

        let data;

        if(receiver === 'buyer')
        {
            data = {bidId: this.props.data.bid._id, receiverId : this.props.data.data.ownerId, receiverRole : 'toReceiver'}
        }else{
            data = {bidId: this.props.data.bid._id, receiverId : this.props.data.data.sellerId, receiverRole : 'toSender'}
        }


        let message;

        if(receiver === 'buyer')
        {
            message = "Coin payment has been made to "+username+". Please confirm that you have received this funds in your wallet";
        }else{
            message = "Coins re-funded to "+username+". Please confirm that you have received this funds in your wallet";
        }

        this.handleSubmit(event, message);


        fetch(Api.releaseCoin,
            {
                method: 'POST',
                body : JSON.stringify(data),
                headers: {
                    Authorization: 'Bearer ' + Session.token,
                    'Content-type': 'application/json',
                    'ip' : ls.get('ip'),
                    'device' : ls.get('device'),
                }
            }).then((res) => res.json())
            .then((response261) => {
                NProgress.done();
                console.log(response261);

                if (response261.status === 'successful') {

                    Swal.fire({
                        title: 'Success!',
                        text: 'Coins released. Dispute ended',
                        icon: 'success',
                        confirmButtonText: 'Ok'
                    });

                    this.endReconcilation(this.props.data.data._id);

                    this.fetchReconcilation();

                }else{
                    Swal.fire({
                        title: 'Failed!',
                        text: response261.err,
                        icon: 'error',
                        confirmButtonText: 'Ok'
                    });
                }
            })
    }

    cancelReconciliation(id)
    {
        NProgress.start();
        NProgress.inc();
        NProgress.configure({ ease: 'ease', speed: 500 });

        console.log(id);

        try {
            fetch(Api.cancelReconciliation,
                {
                    method: 'POST',
                    body: JSON.stringify({
                        bidId: id
                    }),
                    headers: {
                        Authorization: 'Bearer ' + Session.token,
                        'Content-Type' : 'application/json',
                        'ip': ls.get('ip'),
                        'device': ls.get('device'),
                    }
                }).then((res) => res.json())
                .then((response255) => {
                    NProgress.done();
                    console.log(response255);

                    if (response255.status === 'successful') {

                        Swal.fire({
                            title: 'Success!',
                            text: response255.msg,
                            icon: 'success',
                            confirmButtonText: 'Ok'
                        });

                        this.fetchReconcilation();
                        // console.log(this.props.data.data);

                    }else{
                        Swal.fire({
                            title: 'Failed!',
                            text: response255.err,
                            icon: 'error',
                            confirmButtonText: 'Ok'
                        });
                    }
                })
        }catch(e)
        {
            console.log(e.message);
        }
    }


    fetchFirebaseDate()
    {
        const messageRef = firebase.database().ref(this.props.data.data.reconcilationToken);
        messageRef.on('value', (snapshot) => {
            const messages = snapshot.val();
            console.log(messages);
            const messageList = [];

            for(let id in messages)
            {
                messageList.push(messages[id]);
            }
           // console.log(messageList);
            this.setState({messages : messageList.reverse()});
        })
    }

    componentDidMount() {

        Session.validateUser();

        this.fetchAdvert();

        console.log(this.props.data.bid);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.data !== this.props.data)
        {
            this.setState({loading : true});
            this.fetchAdvert();
        }
    }


    render(){
       // this.fetchReconcilation();

        return (
            <div>
                { this.state.loading ? (
                    <Constants.loading />
                ) : (

                    <section className="">
                        <div className="bg-dark sticky-top border_bottom p-3">
                            <h5 className="m-0 font-white d-flex w-auto">Reconcile
                            <div className="dropdown d-flex">
                                <button className="btn btn-sm ms-3 btn-secondary dropdown-toggle" type="button"
                                        id="dropdownMenuButton2" data-bs-toggle="dropdown" aria-expanded="false">
                                    Options
                                </button>
                                <ul className="dropdown-menu dropdown-menu-dark" aria-labelledby="dropdownMenuButton2">
                                    <li><a data-bs-toggle="modal" data-bs-target="#bidInfo" className="dropdown-item active" href="#">View Bid Info</a></li>
                                    {

                                            this.props.data.data.status !== 'closed' ?(
                                                <div>
                                                    {
                                                        Session.username === this.props.data.data.sellerName ? (
                                            <li><a data-bs-toggle="modal" data-bs-target="#endReconciliation"
                                                   className="dropdown-item" href="#">End Reconciliation</a></li>
                                        ) : (null)
                                    }

                                    {
                                        Session.role !== 'regular' ?(
                                    <div>
                                        <li><a onClick={() => this.endReconcilation(this.props.data.data._id)} className="dropdown-item" href="#">Close Reconciliation</a></li>
                                            <li>
                                        <hr className="dropdown-divider"/>
                                    </li>
                                    <li><a data-bs-toggle="modal" data-bs-target="#releaseCoin" className="dropdown-item" href="#">Release Coins</a></li>
                                    </div>
                                        ):(null)
                                    }
                                                </div>
                                    ):(null)
                                    }

                                    {
                                        Session.username === this.props.data.data.ownerName ? (
                                                <li><a onClick={() => {if (confirm('Are you sure you want to cancel your bid?')){this.cancelReconciliation(this.props.data.bid._id)}else{return false}}} className="dropdown-item" href="#">Cancel Bid</a></li>
                                        ):null
                                    }
                                </ul>
                            </div>
                            </h5>
                        </div>
                        <div className="p-3 reconcile ">

                            <div id="reconcile_body" className="border_bottom">

                                {
                                    this.state.messages.map((message,index) =>(

                                        message.sender === 'seller' ?(
                                            <div className="mb-2 ">
                                                <h6 className="font-gray font-xs text-capitalize">{message.username} • {moment(message.date).fromNow()}</h6>
                                                <div className="bg-blue font-white mb-2 d-inline-block p-2 border_radius">

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
                                            ): message.sender === 'buyer' ?(
                                            <div className="text-end mb-2">
                                                <h6 className="font-gray font-xs text-capitalize">{message.username} • {moment(message.date).fromNow()}</h6>
                                                <div className="bg-success font-white mb-2 d-inline-block p-2 border_radius">

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
                                            <div className=" mb-2">
                                                <h6 className="text-danger font-xs text-capitalize">{message.username} • {moment(message.date).fromNow()}</h6>
                                                <div className="bg-red-light  w-100 mb-2 d-inline-block p-2 border_radius">

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
                                <div className="bg-skyblue border p-3 mb-3 border_radius">
                                    <p className="m-0 font-weight-700 text-primary text-uppercase font-uppercase font-xs">Subject</p>
                                    {this.props.data.data.subject}
                                </div>
                            </div>



                            <div className="reconcile_message_container p-2">
                                {
                                    this.props.data.data.status !== 'closed' ?(
                                <form onSubmit={this.handleSubmit}>
                                    <div className="input-group mb-3">
                                        <button className="btn btn-warning" type="button" data-bs-toggle="modal" data-bs-target="#uploadModal"
                                                id="button-addon1"><i className="fa fa-upload"></i> Upload
                                        </button>
                                        <input type="text" className="form-control" onChange={this.handleChange} value={this.state.message.text}
                                               name="text"
                                               placeholder="Enter message and press Enter"/>
                                    </div>

                                </form>
                                    ):(
                                        <div className="alert alert-danger text-center">
                                            This reconciliation process has ended
                                        </div>
                                    )
                                }
                            </div>


                        </div>


                        {/*Upload file*/}
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


                        {/*Bid info*/}
                        <div className="modal fade" id="bidInfo" data-bs-backdrop="static" data-bs-keyboard="false"
                             tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content">
                                    <div className="modal-header bg-warning">
                                        <h5 className="modal-title" id="staticBackdropLabel">Bid Info</h5>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal"
                                                aria-label="Close"></button>
                                    </div>
                                    <div className="modal-body">

                                        <div className="border p-3 pb-0 border_radius mb-2 shadow-sm">
                                            <div className="row">

                                                <div className="col-12 text-center">
                                                    <h5 className="">
                                                        {this.props.data.bid.amount.toFixed(5)} {this.state.advert.asset.toUpperCase()} <i className="fas text-success fa-exchange-alt"></i> ₦{(this.props.data.bid.rate * (this.props.data.bid.amount * this.state.listAsset.rate)).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                    </h5>
                                                    <p className=" font-xs"><badge className="badge font-black bg-success font-white">Rate:</badge> $1 = ₦{this.props.data.bid.rate.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
                                                    {/*<p className="font-xs text-capitalize font-gray"><badge className="badge font-black bg-success font-white">Between</badge></p>*/}
                                                </div>

                                                <div className="col-12 border_top">
                                                    <div className="row">
                                                        <div className="col p-2 border_right text-capitalize">
                                                            <p className="m-0 text-uppercase font-xs font-weight-800">Seller</p>
                                                            {this.props.data.data.sellerName}
                                                        </div>
                                                        <div className="col p-2 text-capitalize">
                                                            <p className="m-0 text-uppercase font-xs font-weight-800">Buyer</p>
                                                            {this.props.data.data.ownerName}
                                                        </div>

                                                    </div>
                                                </div>


                                            </div>

                                        </div>


                                        <h6 className="bg-dark font-white p-2 mt-3 mb-0">Payment Info.</h6>

                                        <div className="border font-sm-2">

                                            <table className="table mb-0 w-100 table-borderless table-hover">
                                                <tbody>
                                                <tr>
                                                    <td>
                                                        <h6>Bank:</h6>
                                                    </td>
                                                    <td>
                                                        {this.state.advert.defaultBank.bankName.toUpperCase()}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <h6>Account Name:</h6>
                                                    </td>
                                                    <td>
                                                        {this.state.advert.defaultBank.accountName.toUpperCase()}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <h6>Account Number:</h6>
                                                    </td>
                                                    <td>
                                                        {this.state.advert.defaultBank.accountNumber.toUpperCase()}
                                                    </td>
                                                </tr>

                                                </tbody>
                                            </table>
                                        </div>

                                    </div>

                                </div>
                            </div>
                        </div>

                        {/*End reconciliation*/}
                        <div className="modal fade" id="endReconciliation" data-bs-backdrop="static" data-bs-keyboard="false"
                             tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content">
                                    <div className="modal-header bg-warning">
                                        <h5 className="modal-title" id="staticBackdropLabel">End Reconciliation</h5>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal"
                                                aria-label="Close"></button>
                                    </div>
                                    <div className="modal-body">

                                    <div className="alert alert-warning">
                                        <p className="m-0">
                                            {
                                                this.props.data.data.ownerId === this.props.data.data.statedReconcilation ? (
                                                    this.props.data.data.ownerName
                                                ):(
                                                    this.props.data.data.sellerName
                                                )
                                            } initiated this reconciliation dispute claiming "<b>{this.props.data.data.subject}</b>"</p>

                                    </div>

                                        {
                                            this.props.data.data.ownerId === this.props.data.data.statedReconcilation ? (
                                                <div>
                                                <button className="btn btn-lg w-100 btn-success"
                                                        onClick={this.coinsReceived}>Coins Received</button>

                                                </div>
                                            ) : (
                                                <button className="btn btn-lg w-100 btn-success"
                                                        onClick={this.paymentReceived}>Payment Received</button>
                                            )
                                        }

                                        {
                                            Session.username === this.props.data.data.ownerName ? (
                                                <button className="btn btn-lg w-100 btn-danger mt-3" onClick={() => this.cancelReconciliation(this.props.data.bid._id)}>Cancel My Bid</button>
                                            ):null
                                        }




                                    </div>

                                </div>
                            </div>
                        </div>


                        {/*Release Coin*/}
                        <div className="modal fade" id="releaseCoin" data-bs-backdrop="static" data-bs-keyboard="false"
                             tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content">
                                    <div className="modal-header bg-warning">
                                        <h5 className="modal-title" id="staticBackdropLabel">Release Coin</h5>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal"
                                                aria-label="Close"></button>
                                    </div>
                                    <div className="modal-body">

                                        <div className="alert alert-warning">
                                            <p className="m-0">
                                                This will release the disputed coins {this.props.data.bid.amount.toFixed(5)} {this.state.advert.asset.toUpperCase()} to the user you select below:</p>

                                        </div>

                                                <div>
                                                    <button className="btn btn-lg w-100 btn-success"
                                                            onClick={() => this.releaseCoin( 'buyer', this.props.data.data.ownerName)}>Release to buyer</button>

                                                    <button className="btn btn-lg w-100 btn-danger mt-3" onClick={() => this.releaseCoin('seller', this.props.data.data.sellerName)}>Release to seller</button>
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



