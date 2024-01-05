export class Log {
  message: string;
  messageTime : Date;

  constructor(message: string) {
    this.message = message;
    this.messageTime = new Date();//Set the current date/time
  }
}
