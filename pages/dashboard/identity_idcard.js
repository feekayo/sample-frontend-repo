import Dashboard_Layout from "../../components/layout/dashboard_layout";
import React, {Component, useEffect, useState} from "react";
import * as Api from "../../components/config/api";
import * as Session from "../../components/config/session";
import * as Constant from "../../components/config/constant";
import * as Constants from "../../components/config/constant";
import Link from "next/link";
import Swal from "sweetalert2";
import NProgress from 'nprogress';
import ls from "local-storage";


export default function app() {
    const [loading, setLoading] = useState(true);
    const [pic, setPic] = useState({
        'dp' : []
    });


    const handlePicChange = e => {
        //const files = Array.from(e.target.files);
        setPic({...pic, [e.target.name]: e.target.files[0]});
    }

    const handleUpload = async e =>
    {
        e.preventDefault();

        try {
            NProgress.start();
            NProgress.inc();
            NProgress.configure({ ease: 'ease', speed: 500 });

            var formdata = new FormData();
            formdata.append("id-card", pic.dp, "idcard.jpg");

            var myHeaders = new Headers();
            myHeaders.append("Authorization", "Bearer " + Session.token);

            const res = await fetch(Api.idCardIdentity, {
                method: 'POST',
                body: formdata,
                headers: {
                    'Authorization': 'Bearer ' + Session.token,
                    'Content-type': 'application/json',
                    'ip': ls.get('ip'),
                    'device': ls.get('device'),
                }
            });

            const json = await res.json();

            if (json.status === 'successful') {
                NProgress.done();
                Swal.fire({
                    title: 'Success!',
                    text: json.msg + ". Please wait",
                    icon: 'success',
                    confirmButtonText: 'Ok'
                });

                setTimeout(function(){ window.location.href='./identity'; }, 3000);

            } else {
                NProgress.done();
                Swal.fire({
                    title: 'Failed!',
                    text: json.err,
                    icon: 'error',
                    confirmButtonText: 'Ok'
                });
            }
        } catch (e) {
            NProgress.done();
            console.log('An error occurred', e);
            Swal.fire({
                title: 'Error!',
                text:  e.message,
                icon: 'error',
                confirmButtonText: 'Ok'
            });

        }
    }

    useEffect(() =>
    {
        Session.validateUser()

        setLoading(false);
    }, []);


    return(
      <Dashboard_Layout title="Identity Verification">
          {loading ? (
              <Constants.loading/>
          ) : (

              <section className="col-lg-10">


                  <div className="row g-4 ">

                      <div className="col-lg-6 mx-auto">

                          <div className="bg-gray mb-4 p-4 rounded">
                              <h5 className="m-0">Identity Card Verification</h5>
                              <p className="font-gray fs-6 mb-4">Upload a picture containing the front of your valid ID card</p>


                              <form onSubmit={handleUpload} className="row g-3 align-items-center">

                                  <div className="col-8 mt-3">

                                      <div className="">
                                          <input type="file" className="form-control" onChange={handlePicChange}
                                                 placeholder="File" name="dp" />

                                      </div>

                                  </div>

                                  <div className="col-4 mt-3">
                                      <button className="btn btn-primary w-100 ">Submit</button>

                                  </div>

                              </form>
                          </div>
                      </div>




                  </div>



              </section>
          )
          }





      </Dashboard_Layout>
  )
}