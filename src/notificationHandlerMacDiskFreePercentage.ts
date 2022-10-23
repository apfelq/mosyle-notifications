import { downloadDeviceList, downloadUserList } from './webUtils.js'
import { tenantInterface } from './index.js'
import { sendMail } from './mailer.js'

export async function notificationHandlerMacDiskFreePercentage (tenant: string, tenantConfig: tenantInterface, url: string, notifications: Promise<boolean>[]): Promise<boolean>
{
    try
    {
        // download device list
        const devices = await downloadDeviceList(tenant, tenantConfig, url, "mac", ['device_name', 'asset_tag', 'userid', 'percent_disk'])
        console.log(`${tenant}: notificationHandlerMacDiskFreePercentage downloaded deviceList`)

        // download user list
        const users = await downloadUserList(tenant, tenantConfig, url)
        console.log(`${tenant}: notificationHandlerMacDiskFreePercentage downloaded userList`)

        for (let device of devices)
        {
            if (device.percent_disk < tenantConfig.notifications.diskFreePercentage/100)
            {
                for (let user of users)
                {
                    if (device.userid === user.identifier)
                    {
                        const message = `Dear ${user.name},\r\n\r\nURGENT: The disk space of your device "${device.device_name}" is nearly full!\r\n\r\nTo avoid rendering your device unusable, please delete some unnecesary files to create more space. Please check your Desktop and Downloads folder for obsolete files.\r\n\r\nBut in first place consider setting most of your "offline available" Dropbox files back to "online only" and additionally consider using the script "Dropbox: Clean Caches" from within the Self-Service app.\r\n\r\nYour CRAZE IT.`
                        notifications.push(sendMail(tenant, 'ATTENTION: your disk is nearly full!', message, `${user.email},alexander.harm@apfelq.com`))
                    }
                }
            }
        }

        console.log(`${tenant}: notificationHandlerMacDiskFreePercentage finished processing lists`)
        return true
    }
    catch (e)
    {
        console.error(`${tenant}: notificationHandlerMacDiskFreePercentage failed with error "${e.message}"`)
        return false
    }
    
}