var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { downloadDeviceList, downloadUserList } from './webUtils.js';
import { sendMail } from './mailer.js';
export function notificationHandlerMacDiskFreePercentage(tenant, tenantConfig, url, notifications) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const devices = yield downloadDeviceList(tenant, tenantConfig, url, "mac", ['device_name', 'asset_tag', 'userid', 'percent_disk']);
            console.log(`${tenant}: notificationHandlerMacDiskFreePercentage downloaded deviceList`);
            const users = yield downloadUserList(tenant, tenantConfig, url);
            console.log(`${tenant}: notificationHandlerMacDiskFreePercentage downloaded userList`);
            for (let device of devices) {
                if (device.percent_disk < tenantConfig.notifications.diskFreePercentage / 100) {
                    for (let user of users) {
                        if (device.userid === user.identifier) {
                            const message = `Dear ${user.name},\r\n\r\nURGENT: The disk space of your device "${device.device_name}" is nearly full!\r\n\r\nTo avoid rendering your device unusable, please delete some unnecesary files to create more space. Please check your Desktop and Downloads folder for obsolete files.\r\n\r\nBut in first place consider setting most of your "offline available" Dropbox files back to "online only" and additionally consider using the script "Dropbox: Clean Caches" from within the Self-Service app.\r\n\r\nYour CRAZE IT.`;
                            notifications.push(sendMail(tenant, 'ATTENTION: your disk is nearly full!', message, `${user.email},alexander.harm@apfelq.com`));
                        }
                    }
                }
            }
            console.log(`${tenant}: notificationHandlerMacDiskFreePercentage finished processing lists`);
            return true;
        }
        catch (e) {
            console.error(`${tenant}: notificationHandlerMacDiskFreePercentage failed with error "${e.message}"`);
            return false;
        }
    });
}
