import { FooterData, HeaderData } from '@n7-frontend/components';

export type ConfigCommonCommunication = {
  /** default provider id */
  defaultProvider: string;
  providers: {
    [providerId: string]: {
      /** api type: rest | apollo (graphql) */
      type: 'rest' | 'apollo';
      /** api base url */
      baseUrl: string;
      /** request map: request id => api point */
      config: {
        [requestId: string]: string;
      };
    };
  };
};

export type ConfigCommonFooter = FooterData;

export type ConfigCommonHeader = Partial<HeaderData>;

export type ConfigCommonLabels = {
  [key: string]: string;
};
