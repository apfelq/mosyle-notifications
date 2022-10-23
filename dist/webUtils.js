var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import got from 'got';
export function downloadDeviceList(tenant, tenantConfig, url, os, columns) {
    return __awaiter(this, void 0, void 0, function* () {
        let devices = [];
        for (let i = 1; i < 1000; i++) {
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
            };
            try {
                const data = yield got.post(options).json();
                if (data.status && data.status === 'OK') {
                    if (data.response[0].rows > 0) {
                        devices.push(...data.response[0].devices);
                    }
                    else
                        break;
                }
                else {
                    console.error(`${tenant}: downloadDeviceList failed with api error "${data.response[0].info}"`);
                    break;
                }
            }
            catch (e) {
                console.error(`${tenant}: downloadDeviceList failed with error "${e.message}"`);
                break;
            }
        }
        return devices;
    });
}
export function downloadUserList(tenant, tenantConfig, url) {
    return __awaiter(this, void 0, void 0, function* () {
        let users = [];
        for (let i = 1; i < 1000; i++) {
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
            };
            try {
                const data = yield got.post(options).json();
                if (data.status && data.status === 'OK') {
                    if (data.response[0].rows > 0) {
                        users.push(...data.response[0].users);
                    }
                    else
                        break;
                }
                else {
                    console.error(`${tenant}: downloadUserList failed with api error "${data.response[0].info}"`);
                    break;
                }
            }
            catch (e) {
                console.error(`${tenant}: downloadUserList failed with error "${e.message}"`);
                break;
            }
        }
        return users;
    });
}
