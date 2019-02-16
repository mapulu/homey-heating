import { AllowedSetting, ManagerSettings } from "homey";
import { EventDispatcher } from "strongly-typed-events";
import { singleton } from "tsyringe";
import { ILogger, LoggerFactory, trycatchlog } from "../log";
import { AllSettings } from "./types";

@singleton()
export class SettingsManagerService {
    private logger: ILogger;
    private onChangedDispatcher = new EventDispatcher<SettingsManagerService, {
        setting: string,
        value: any,
    }>();

    private devSettings: { [key: string]: string } = {};

    constructor(factory: LoggerFactory) {
        this.logger = factory.createLogger("Settings");
    }

    public get onChanged() {
        return this.onChangedDispatcher.asEvent();
    }

    // Catastrophic failure, cannot be handeled here.
    @trycatchlog()
    public get<T extends AllowedSetting>(setting: AllSettings, def: T = null): T {
        let val = PRODUCTION
            ? ManagerSettings.get<T>(setting)
            : this.devSettings[setting] as unknown as T;

        if (val == null || val === undefined) { val = def; }

        this.logger.debug(`Get '${setting}' => '${val}'`);
        return val;
    }

    // Catastrophic failure, cannot be handeled here.
    @trycatchlog()
    public set<T extends AllowedSetting>(setting: AllSettings, val: T) {
        this.logger.debug(`Put '${setting}' <= '${val}'`);

        try {
            if (PRODUCTION) {
                if (val == null) { ManagerSettings.unset(setting); } else { ManagerSettings.set(setting, val); }
            } else {
                if (val == null) { delete this.devSettings[setting]; } else { this.devSettings[setting] = "" + val; }
            }
        } finally {
            this.onChangedDispatcher.dispatch(this, {
                setting,
                value: val,
            });
        }
    }
}
