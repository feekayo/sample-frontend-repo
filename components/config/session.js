import React, { useState } from 'react';
import ls from 'local-storage'
import * as Constants from "./constant";
import * as Api from "./api";



export function validateUser()
{
    const loggedInUser = ls.get("v_token");

    if(!loggedInUser)
    {
        ls.clear();
        window.location.href = "/access/login";
    }
}

export function confirmUser()
{
    const token = ls.get("v_token");

    fetch(Api.fetchUser,
        {
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + token
            }
        }).then((res) => res.json())
        .then((response26) => {

            if(response26.status === 'failed')
            {
                ls.clear();
                window.location.href = "/access/login";
            }else {
               // console.log(response26);
            }

        })

}


export function validateAdmin()
{
    const loggedInUser = ls.get("v_token");

    if(ls.get('type') === 'ADMIN') {
        if (!loggedInUser) {
            ls.clear();
            window.location.href = "/access/login";
        }
    }
}


export function logout()
{
    ls.clear();
    window.location.href = "/";
    //router.go('/');

}


export function InitializeUser(user_data)
{
    ls.set('token', user_data.token);




    // if(user_data.data.dp === undefined)
    // {
    //     ls.set('dp', '/images/loading.gif');
    // }else{
    //     ls.set('dp', user_data.data.dp);
    // }
}
export function validate2fa(twoFa)
{
    if(twoFa === true)
    {
        window.location.href = '/access/twofa';
    }else{
        this.redirectUser();
    }
}
export function redirectUser()
{
    //const userType = ls.get("type");


    //if(ls.get("v_role") === 'admin' || ls.get("v_role") === 'customerService' || ls.get("v_role") === 'superAdmin' )
    if(ls.get('v_role') === 'd1-2H298HF-24FJ-29F9f32hf2h023-3208h2803hf283f2')
    {
        window.location.href = '/trade';
    }else if(ls.get('v_role') === 'c2j0f-0F22F09wf23-9H2F08HF02-f2F32H083Finfo23fno2')
    {
        window.location.href = '/admin';
    }else if(ls.get('v_role') === 'di2h213f2-f2f4g395-3g-3g9329j4-23ff__e2')
    {
        window.location.href = '/admin';
    }else if(ls.get('v_role') === 'v3092-30O0O00O0OOO0O0OO0O-0OO00-O0O0-02f20-230O02O0F2-2fo')
    {
        window.location.href = '/admin';
    }else{
        console.log('user type not found '+ this.role);
    }
}

export const username  = ls.get("v_us");
export const firstname  = ls.get("v_firstname");
export const lastname  = ls.get("v_lastname");
export const token  = ls.get("v_token");
export let role;

if(ls.get('v_role') === 'd1-2H298HF-24FJ-29F9f32hf2h023-3208h2803hf283f2')
{
    role  = 'regular';
}else if(ls.get('v_role') === 'c2j0f-0F22F09wf23-9H2F08HF02-f2F32H083Finfo23fno2')
{
    role  = 'admin';
}else if(ls.get('v_role') === 'di2h213f2-f2f4g395-3g-3g9329j4-23ff__e2')
{
    role  = 'customerService';
}else if(ls.get('v_role') === 'v3092-30O0O00O0OOO0O0OO0O-0OO00-O0O0-02f20-230O02O0F2-2fo')
{
    role  = 'superAdmin';
}

export const type  = ls.get("v_type");
export const id  = ls.get("v_id");
export const dp  = ls.get("dp");
export const currentAsset = ls.get('currentAsset');
export const assets = ls.get('assets');
export let twoFa;

if(ls.get('128303002') === '100OOO001O0O000OO00O0O010O0O011O00O00')
{
    twoFa = true
}else(
    twoFa = false
)




export function setLanguage(lang)
{
    if(lang) {
        ls.set('lang', lang);
        //router.push(window.top.location);
        window.location.reload();
    }else {
        if (!ls.get('lang')) {
            ls.set('lang', 'en');
        }
    }


}

export default function index()
{




}

