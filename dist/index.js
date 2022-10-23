var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import fs from 'graceful-fs';
import yaml from 'js-yaml';
import { notificationHandlerMacDiskFreePercentage } from './notificationHandlerMacDiskFreePercentage.js';
export let mailConfig;
function importYaml(fileName) {
    try {
        return yaml.load(fs.readFileSync(`${fileName}.yaml`, 'utf8'));
    }
    catch (e) {
        console.log(e);
    }
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        let config = importYaml('config');
        mailConfig = config.mail;
        let notifications = [];
        const tenants = Object.keys(config.mosyle.tenants);
        const updates = [];
        for (let tenant of tenants) {
            if (config.mosyle.tenants[tenant].notifications.diskFreePercentage) {
                yield notificationHandlerMacDiskFreePercentage(tenant, config.mosyle.tenants[tenant], config.mosyle.url, notifications);
            }
        }
        yield Promise.all(notifications);
        console.log('all notifications sent');
    });
}
main();
