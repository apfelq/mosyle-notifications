var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import nodemailer from 'nodemailer';
import { mailConfig } from './index.js';
export function sendMail(tenant, subject, msg, to) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let transporter = nodemailer.createTransport({
                host: mailConfig.server,
                port: mailConfig.port,
                secure: mailConfig.port === 465 ? true : false,
                auth: {
                    user: mailConfig.username,
                    pass: mailConfig.password
                }
            });
            let info = yield transporter.sendMail({
                from: mailConfig.from,
                to: to,
                subject: subject,
                text: msg
            });
            console.log(`${tenant}: notification mail sent to "${to}"`);
            return true;
        }
        catch (e) {
            console.error(`${tenant}: mail notification failed with error "${e.message}"`);
            return false;
        }
    });
}
