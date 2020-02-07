export interface ICommunicationProvider {
  request$(providerId: string, requestId: string, options: any);
}