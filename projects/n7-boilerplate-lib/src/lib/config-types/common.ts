import { FooterData, HeaderData } from '@n7-frontend/components';

export type CommunicationConfig = {
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

export type FooterConfig = FooterData;

export type HeaderConfig = Partial<HeaderData>;

export type LabelsConfig = {
  [key: string]: string;
};
