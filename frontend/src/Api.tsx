import axios from "axios";

const api = axios.create({
    baseURL: 'https://api.tradealysis.cf/'
});

function setLoginKey(str1Value: string, str2Value: string): void
{
    api.get('loginKeyGET', {
        params: {
            username: `${str1Value}`,
            password: `${str2Value}`
        }
    })
        .then(res =>
        {
            const val = res.data;
            if (val !== "")
            {
                localStorage.setItem("Key", val);
                window.location.reload();
            }
        })
        .catch((err: Error) =>
        {
            return Promise.reject(err);
        })
        .finally(() =>
        {
            str1Value = '';
            str2Value = '';
        });
}

function saveTable(tableData: any): void
{
    api.post(`postTableDB`, {
        dataArray: tableData
    }).then(function(response)
    {
        return;
    }).catch(function(error)
    {
        console.log('Error', error);
    });
}

function getAccountInformation(theKey: string, state: any): any
{
    api.get('accountunameFromKeyGET', {
        params: {
            key: `${theKey}`,
        }
    }
    )
        .then((res) =>
        {
            api.get('accountfNameFromKeyGET', {
                params: {
                    key: `${theKey}`,
                }
            })
                .then((res2)=>
                {
                    api.get('accountlNameFromKeyGET', {
                        params: {
                            key: `${theKey}`,
                        }
                    })
                        .then((res3)=>
                        {
                            api.get('accountemailFromKeyGET', {
                                params: {
                                    key: `${theKey}`,
                                }
                            })
                                .then((res4)=>
                                {
                                    api.get('accountphoneFromKeyGET', {
                                        params: {
                                            key: `${theKey}`,
                                        }
                                    })
                                        .then((res5)=>
                                        {
                                            api.get('accountbdateFromKeyGET', {
                                                params: {
                                                    key: `${theKey}`,
                                                }
                                            })
                                                .then((res6) =>
                                                {
                                                    console.log(state);
                                                    state.uname.value = res.data;
                                                    state.pssd.value = "";
                                                    state.fName.value = res2.data;
                                                    state.lName.value = res3.data;
                                                    state.email.value = res4.data;
                                                    state.phone.value = res5.data;
                                                    state.date.value = res6.data;
                                            
                                                    const data = res.data;
                                                    return data;
                                                });
                                        });
                                });
        
        
                        });
                });
        })
        .catch((err: Error) =>
        {
            return Promise.reject(err);
        });
}

export { setLoginKey, saveTable, getAccountInformation };
