export interface CommunicationProvider {
  request$(
    providerConfig: any,
    requestId: string,
    options: any
  );
}
