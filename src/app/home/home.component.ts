import { Component, OnInit } from '@angular/core';
import { HubConnection } from '@aspnet/signalr';
import * as signalR from '@aspnet/signalr';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  private _hubConnection: HubConnection | undefined;
    public async: any;
    message = '';
    messages: string[] = [];

  constructor() { }

  public sendMessage(): void {
    const data = `Sent: ${this.message}`;

    if (this._hubConnection) {
        this._hubConnection.invoke('Send', data);
    }
    this.messages.push(data);
}

  ngOnInit() {

    this._hubConnection = new signalR.HubConnectionBuilder()
            .withUrl('https://localhost:44340/loopy',
            {
                skipNegotiation: true,
                transport: signalR.HttpTransportType.WebSockets
          
            })
            .configureLogging(signalR.LogLevel.Information)
            .build();
 
        this._hubConnection.start().then(()=>{console.log('Hub connection started')})
        .catch(err => console.log('Error while establishing connection'));
 
        this._hubConnection.on('Send', (data: any) => {
            const received = `Received: ${data}`;
            this.messages.push(received);
        });

  }

}
