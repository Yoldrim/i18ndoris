export interface Message {
  id: string;               // used for integration with translation platforms
  hash: string;             // used for text change detection beyond id length
  defaultMessage: string;   // message
}
