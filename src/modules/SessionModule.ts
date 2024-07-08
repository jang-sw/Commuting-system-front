import axios from 'axios';
import qs from 'qs';

export const chkSession = async (serverUrl: string) => {
    const token = sessionStorage.getItem('token')
    const userInfo = sessionStorage.getItem('userInfo')
    if(!token || !userInfo ){
        return;
    }
    const parsedUserInfo: any = qs.parse(userInfo ?? '');
    return await axios.get(
        `${serverUrl}/api/account/chkUserInfo`,
        {
            headers: { 
            'content-type': 'application/x-www-form-urlencoded' 
            , 'accountId' : parsedUserInfo['accountId']
            , 'Authorization': token
            },
            params: {
                auth: parsedUserInfo['auth'],
                email: parsedUserInfo['email'],
                name: parsedUserInfo['name'],
            }
        }
    ).then( async (res)=>{
        if(res.data.result == 1){
           return 1;
        }else{
           return await refreshSession(serverUrl)
        } 
    }).catch( async (err) =>{
        console.log(err)
        return await refreshSession(serverUrl)
    })
}

export const refreshSession = async (serverUrl: string) => {
    
    const token = sessionStorage.getItem('token')
    const userInfo = sessionStorage.getItem('userInfo')
    if(!token || !userInfo ){
        sessionStorage.removeItem('token')
        sessionStorage.removeItem('userInfo')
        return -1;
    }
    const parsedUserInfo: any = qs.parse(userInfo ?? '');

    await axios.get(
      `${serverUrl}/openApi/account/refresh`,
      {
        headers: { 
          'content-type': 'application/x-www-form-urlencoded' 
          , 'accountId' : parsedUserInfo['accountId']
          , 'Authorization': token
        }
      }
    ).then(async (res)=>{
      if(res.data.result == 1){
        sessionStorage.setItem('token' ,res.headers['authorization']);
        return 1;
      }else{
        sessionStorage.removeItem('token')
        sessionStorage.removeItem('userInfo')
        return -1;
      }
    }).catch(async (err) =>{
        console.log(err)
        sessionStorage.removeItem('token')
        sessionStorage.removeItem('userInfo')
        return -1;
    })
  }