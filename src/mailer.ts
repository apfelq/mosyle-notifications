import nodemailer from 'nodemailer'
import { mailConfig } from './index.js'

export interface attachmentInterface
{
    path: string
}

export async function sendMail (tenant: string, subject: string, msg: string, to: string): Promise<boolean>
{
    try
    {
        // create the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: mailConfig.server,
            port: mailConfig.port,
            secure: mailConfig.port === 465 ? true : false,
            auth: {
                user: mailConfig.username,
                pass: mailConfig.password
            }
        })

        // send mail
        let info = await transporter.sendMail({
            from: mailConfig.from,
            to: to,
            subject: subject,
            text: msg
        })
        
        console.log(`${tenant}: notification mail sent to "${to}"`)
        return true
    }
    catch (e)
    {
        console.error(`${tenant}: mail notification failed with error "${e.message}"`)
        return false
    }
}