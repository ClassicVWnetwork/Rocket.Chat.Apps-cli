import { IServerSettingBridge } from 'temporary-rocketlets-server/server/bridges';
import { ISetting } from 'temporary-rocketlets-ts-definition/settings';

export class ServerSettingBridge implements IServerSettingBridge {
    public getAll(rocketletId: string): Array<ISetting> {
        throw new Error('Method not implemented.');
    }

    public getOneById(id: string, rocketletId: string): ISetting {
        throw new Error('Method not implemented.');
    }

    public hideGroup(name: string): void {
        throw new Error('Method not implemented.');
    }

    public hideSetting(id: string): void {
        throw new Error('Method not implemented.');
    }

    public isReadableById(id: string, rocketletId: string): boolean {
        throw new Error('Method not implemented.');
    }

    public updateOne(setting: ISetting, rocketletId: string): void {
        throw new Error('Method not implemented.');
    }
}
