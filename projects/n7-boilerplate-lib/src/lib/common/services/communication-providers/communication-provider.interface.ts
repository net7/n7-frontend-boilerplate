export interface CommunicationProvider {
  request$(requestId: string, options: any);
}
