import { FooterData, HeaderData } from '@net7/components';

export type ConfigCommonCommunication = {
  /** default provider id */
  defaultProvider: string;
  providers: {
    [providerId: string]: {
      /** api base url */
      baseUrl: string;
      /** api type: rest | apollo (graphql) */
      type?: 'rest' | 'apollo';
      /** request map: request id => api point */
      config?: {
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
