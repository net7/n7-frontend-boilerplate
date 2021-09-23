import { FooterData, HeaderData } from '@n7-frontend/components';

export type ConfigCommonCommunication = {
  defaultProvider: string;
  providers: {
    [providerId: string]: {
      type: 'rest' | 'apollo';
      baseUrl: string;
      config: {
        [requestId: string]: string; // requestId => api point
      };
    };
  };
};

export type ConfigCommonFooter = FooterData;

export type ConfigCommonHeader = Partial<HeaderData>;

export type ConfigCommonLabels = {
  [key: string]: string;
};
