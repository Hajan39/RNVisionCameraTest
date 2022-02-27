export interface UserConfigServer {
  favouriteFilter: string;
  showPreview: 'NP' | '3S' | 'PV';
  serverUploadInterval: number;
  deleteDocumentsInterval: number;
  environment: 'production' | 'test';
  cameraSettings: CameraSettingServer[];
}

export interface UserConfig {
  favouriteFilter: string;
  showPreview: 'NP' | '3S' | 'PV';
  serverUploadInterval: number;
  deleteDocumentsInterval: number;
  environment: 'production' | 'test';
  cameraSettings: CameraSetting;
}

export enum CameraType {
  Native = 'Fotoaparát telefonu',
  SmartExperta = 'Fotoaparát SmartExperta',
}

export interface CameraSetting {
  cameraType: CameraType;
  flashMode: 'auto' | 'off' | 'on';
  ratio: string;
  volumeUp: boolean;
  torchOn: boolean;
}
export interface CameraSettingServer {
  setting: 'flashMode' | 'ratio' | 'volumeUp' | 'torchOn' | 'cameraType';
  value: string;
}

export const getDefaultUserConfig = (
  data: Partial<UserConfig>,
): UserConfig => ({
  favouriteFilter: '',
  showPreview: 'PV',
  serverUploadInterval: 0,
  deleteDocumentsInterval: 30 * 24 * 60 * 60,
  environment: 'production',
  cameraSettings: {
    cameraType: CameraType.SmartExperta,
    flashMode: 'off',
    torchOn: false,
    ratio: '16:9',
    volumeUp: true,
  },
  ...data,
});

export const transferUserConfigFrom = (
  data: Partial<UserConfig>,
): UserConfigServer => ({
  favouriteFilter: data.favouriteFilter || '',
  showPreview: data.showPreview || 'PV',
  serverUploadInterval: data.serverUploadInterval || 0,
  deleteDocumentsInterval: data.deleteDocumentsInterval || 30 * 24 * 60 * 60,
  environment: data.environment || 'production',
  cameraSettings: [
    {
      setting: 'flashMode',
      value: data.cameraSettings?.flashMode.toString() || 'off',
    },
    {
      setting: 'torchOn',
      value: data.cameraSettings?.torchOn.toString() || 'false',
    },
    {
      setting: 'ratio',
      value: data.cameraSettings?.ratio.toString() || '16:9',
    },
    {
      setting: 'volumeUp',
      value: data.cameraSettings?.volumeUp.toString() || 'false',
    },
    {
      setting: 'cameraType',
      value: data.cameraSettings?.cameraType || CameraType.Native,
    },
  ],
});

export const transferUserConfigTo = (
  data: Partial<UserConfigServer>,
): UserConfig => ({
  favouriteFilter: data.favouriteFilter || '',
  showPreview: data.showPreview || 'PV',
  serverUploadInterval: data.serverUploadInterval || 0,
  deleteDocumentsInterval: data.deleteDocumentsInterval || 30 * 24 * 60 * 60,
  environment: data.environment || 'production',
  cameraSettings: {
    cameraType: data.cameraSettings?.find(
      camSetting => camSetting.setting === 'cameraType',
    )?.value as CameraType,
    flashMode:
      (data.cameraSettings?.find(
        camSetting => camSetting.setting === 'flashMode',
      )?.value as 'auto' | 'off' | 'on') || 'off',
    torchOn:
      data.cameraSettings?.find(camSetting => camSetting.setting === 'torchOn')
        ?.value === 'true' || false,
    ratio:
      data.cameraSettings?.find(camSetting => camSetting.setting === 'ratio')
        ?.value || '16:9',
    volumeUp:
      data.cameraSettings?.find(camSetting => camSetting.setting === 'volumeUp')
        ?.value === 'true' || false,
  },
});
