import React, {Component, useState} from 'react';
import ls from "local-storage";
import { io } from 'socket.io-client';
import openSocket from 'socket.io-client';


export function subscribe() {
    const io = require("socket.io-client");
    const socket = io('http://valorexchange.herokuapp.com/api/socket', {
        withCredentials: true,
    });

    socket.on('subscribed-coins', data  => {
            console.log(data);
    });
    //socket.emit('subscribeToTimer', 1000);
}