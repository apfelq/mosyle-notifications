import fs from 'graceful-fs'
import yaml from 'js-yaml'
import { notificationHandlerMacDiskFreePercentage } from './notificationHandlerMacDiskFreePercentage.js'

export let mailConfig: mailInterface

export interface mailInterface
{
    server: string,
    port: number,
    from: string,
    to: string,
    username: string,
    password: string
}

export interface notificationInterface
{
    diskFreePercentage?: number
}

export interface tenantInterface
{
    username: string,
    password: string,
    accesstoken: string,
    notifications: notificationInterface
}

export interface mosyleInterface
{
    url: string,
    tenants: tenantInterface[]
}

function importYaml (fileName: string): any
{
    try {
        return yaml.load(fs.readFileSync(`${fileName}.yaml`, 'utf8'))
    } catch (e) {
        console.log(e)
    }
}

async function main ()
{

    // import config
    let config: {mail: mailInterface, mosyle: mosyleInterface} = importYaml('config')

    // mail config
    mailConfig = config.mail

    // create promise array
    let notifications: Promise<boolean>[] = []

    // iterate through tenants
    const tenants: string[] = Object.keys(config.mosyle.tenants)
    const updates: string[] = []

    for (let tenant of tenants)
    {
        if (config.mosyle.tenants[tenant].notifications.diskFreePercentage)
        {
            await notificationHandlerMacDiskFreePercentage(tenant, config.mosyle.tenants[tenant], config.mosyle.url, notifications)
        }
    }

    // wait for all updateHandler to finish
    await Promise.all(notifications)

    console.log('all notifications sent')
    
}

main()