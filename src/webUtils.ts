import got from 'got'
import { tenantInterface } from './index.js'

interface dataInterface
{
    status: string,
    response: [{
        devices?: any,
        info?: string,
        rows?: number,
        users?: any
    }]
}

export async function downloadDeviceList (tenant: string, tenantConfig: tenantInterface, url: string, os: string, columns: string[]): Promise<any> 
{

    let devices = []

    for (let i = 1; i < 1000; i++)
    {

        const options = {
            url: `${url}/devices`,
            username: tenantConfig.username,
            password: encodeURI(tenantConfig.password),
            headers: {
                'accesstoken': tenantConfig.accesstoken,
                'content-type': 'application/x-www-form-urlencoded'
            },
            json: {        
                operation: 'list',
                options: {
                    os: os,
                    specific_columns: columns,
                    page: i
                }
            },
            followRedirect: true
        }

        try
        {
            const data: dataInterface = await got.post(options).json()
            if (data.status && data.status === 'OK')
            {
                if (data.response[0].rows > 0)
                {
                    devices.push(...data.response[0].devices)
                }
                else break
            }
            else
            {
                console.error(`${tenant}: downloadDeviceList failed with api error "${data.response[0].info}"`)
                break
            }
        }
        catch (e)
        {
            console.error(`${tenant}: downloadDeviceList failed with error "${e.message}"`)
            break
        }

    }

    return devices
}

export async function downloadUserList (tenant: string, tenantConfig: tenantInterface, url: string): Promise<any> 
{

    let users = []

    for (let i = 1; i < 1000; i++)
    {

        const options = {
            url: `${url}/users`,
            username: tenantConfig.username,
            password: encodeURI(tenantConfig.password),
            headers: {
                'accesstoken': tenantConfig.accesstoken,
                'content-type': 'application/x-www-form-urlencoded'
            },
            json: {        
                operation: 'list_users',
                options: {
                    page: i
                }
            },
            followRedirect: true
        }

        try
        {
            const data: dataInterface = await got.post(options).json()
            if (data.status && data.status === 'OK')
            {
                if (data.response[0].rows > 0)
                {
                    users.push(...data.response[0].users)
                }
                else break
            }
            else
            {
                console.error(`${tenant}: downloadUserList failed with api error "${data.response[0].info}"`)
                break
            }
        }
        catch (e)
        {
            console.error(`${tenant}: downloadUserList failed with error "${e.message}"`)
            break
        }

    }

    return users
}