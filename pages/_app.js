import '../cdn/b5/css/bootstrap.css'
import '../cdn/css/App.css';
import "../cdn/css/look_css/css/look_base_v2.css";
import * as Constants from "../components/config/constant";
import activityContext from "../components/config/context";
import React, {useState,useEffect} from "react";
import io from "socket.io-client";
import ls from "local-storage";
import * as Session from "../components/config/session";
import "react-notifications/lib/notifications.css";
import {NotificationContainer, NotificationManager} from "react-notifications";
import ReactGA from 'react-ga';
import firebase from "firebase";
import * as Api from "../components/config/api";
import Big from "big.js";


function MyApp({ Component, pageProps, err }) {
  Constants.setAssets();
  Constants.ticker('false');
  //const socket2 =  io.connect(process.env.SOCKET);
  const [loading, setLoading] = useState(true);
  const [wallets, setWallets] = useState([]);
  const [showWallet, setShowWallet] = useState(false);
  const [assets, setAssets] = useState(ls.get('assets'));
    let socket2 = null;


    function initializeFirebase()
    {
        const config = {
            apiKey: process.env.FIREBASE_API_KEY,
            authDomain: process.env.FIREBASE_AUTH_DOAMIN,
            databaseURL: process.env.FIREBASE_DATABASE_URL,
            projectId: process.env.FIREBASE_PROJECT_ID,
            storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
            messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
            appId: process.env.FIREBASE_APP_ID
        };

        if( firebase.apps.length === 0 ){
            firebase.initializeApp(config);
        }
    }

    function fetchUserNotifications()
    {
        if(ls.get('v_token')) {
            const messageRef = firebase.database().ref(  '/notifications/' + Session.id);
            messageRef.on('value', (snapshot) => {
                const messages = snapshot.val();
                // console.log(messages);
                const id = snapshot.key;
                const messageList = [];
                let counter = 0;

                if(messages) {
                    for (let id in messages) {
                        let array = {'message' : messages[id].message, 'date' : messages[id].timestamp};
                        messageList.push(array);

                        if(messages[id].status === true)
                        {
                            //openNotificationWithIcon('success','Wallet Transaction', messages[id].message);

                            NotificationManager.info(messages[id].msg, "", 5000);

                            fetchWallets();

                            let key = Object.keys(messages)[counter];
                            messageRef.child(key).update({'status': false})
                        }

                        counter++;
                    }
                }
                //console.log(id);
              //  this.setState({generalNotification : messageList});

            });


        }
    }

    function fetchWallets()
    {
        setShowWallet(false);
        let walletArray = [];

        assets.map((asset,index) => {

            fetch(Api.fetchSingleWallet + '?asset=' + asset.abbr.toLowerCase(),
                {
                    method: 'GET',
                    headers: {
                        Authorization: 'Bearer ' + Session.token
                    }
                }).then((res) => res.json())
                .then((response26) => {

                    if(response26.data !== undefined) {

                        let walletData = [];

                        walletData.push(response26.data, {rate : asset.rate});
                        walletArray.push(walletData);

                        setWallets(walletArray);
                    }

                })

        })

        if(wallets.length >= 1) {
            setShowWallet(true);
        }


    }

    useEffect(() => {
        initializeFirebase();
        fetchUserNotifications();
        fetchWallets();

        if(ls.get('v_token')) {
            //console.log('i am here');
        //    socket2.emit("connect-to-your-participating-bids", Session.id);
        }



        ReactGA.initialize(process.env.GOOGLEANALYTICS);


        if(!ls.get('ip')) {
            fetch('http://www.geoplugin.net/json.gp',
                {
                    method: 'GET',
                }).then((res) => res.json())
                .then((response261) => {
                    ls.set('ip', response261.geoplugin_request);
                });

            ls.set('device', (navigator.platform, navigator.userAgent, navigator.appVersion))
        }

        // socket2.on("notification", (result) => {
        //     //console.log( result);
        //     if(result !== null) {
        //         NotificationManager.info(result.msg, "", 5000);
        //     }
        // });

    }, [loading]);


  return (
      <activityContext.Provider value={{socket2, initializeFirebase, firebase, showWallet, wallets}}>
        <Component {...pageProps} err={err} />
        <NotificationContainer />
          <React.Fragment>
              <script dangerouslySetInnerHTML={{ __html: `!function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '724635218421059');
      fbq('track', 'PageView');` }}
              />
              <noscript dangerouslySetInnerHTML={{ __html: `<img height="1" width="1" style="display:none"
      src="https://www.facebook.com/tr?id=724635218421059&ev=PageView&noscript=1" />` }}
              />
          </React.Fragment>
      </activityContext.Provider>
  )
}

export default MyApp;
