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
    const [identityCheck, setIdentityCheck] = useState({
        'bvn' : 0,
        'id' : 0,
        'face' : 0,
        'address' : 0
    });
    const [address, setAddress] = useState(true);


    const handleChange = e =>
        setAddress({ ...address, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();

        try {
            NProgress.start();
            NProgress.inc();
            NProgress.configure({ ease: 'ease', speed: 500 });

            const res = await fetch(Api.addressIdentity, {
                method: 'POST',
                body: JSON.stringify(address),
                headers: {
                    'Authorization': 'Bearer ' + Session.token,
                    'Content-type': 'application/json',
                    'ip' : ls.get('ip'),
                    'device' : ls.get('device'),
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
                text: 'An error occurred while submitting the form',
                icon: 'error',
                confirmButtonText: 'Ok'
            });

        }
    };

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
                              <h5 className="m-0">Address Verification</h5>
                              <p className="font-gray fs-6 mb-4">Enter your physical address below:</p>


                              <form onSubmit={handleSubmit} className="align-items-center">

                                  <div className="col-12">

                                      <div className="form-floating">
                                          <textarea  className="h-50 form-control" onChange={handleChange}
                                                 placeholder="Address" name="address" />
                                                 <label>Enter your address</label>
                                      </div>

                                      <button className="btn btn-primary btn-lg mt-3 ">Submit</button>

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