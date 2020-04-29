export interface CommunicationProvider {
  request$(
    providerConfig: any,
    providerId: string,
    requestId: string,
    options: any
  );
}
