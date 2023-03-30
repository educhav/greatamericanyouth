import { Component, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';

import { Socket } from 'ngx-socket-io';
import { Subscription } from 'rxjs';
import { GAY_URL } from 'src/constants/api';
import { CHAT_AVATARS } from 'src/constants/constants';
import { AuthService } from 'src/services/auth.service';
import { ChatService } from 'src/services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  providers: [AuthService, ChatService]
})
export class ChatComponent implements OnDestroy, AfterViewInit {

  messages: any[] = [];
  sender: string = "";
  content: string = "";
  time: number = 0;
  formattedTime: Date = new Date();
  subscriptions: Subscription[] = [];
  avatars: any;
  socketLoading: Map<number, boolean> = new Map<number, boolean>();
  url: string = "";
  scrollEpsilon: number = 110;
  notificationSound: any = new Audio(GAY_URL + 'chat-media/meta/sounds/moaning.mp3')
  messageSound: any = new Audio(GAY_URL + 'chat-media/meta/sounds/bleep.mp3')

  @ViewChild('chatbox')
  chatbox!: ElementRef;


  constructor(private socket: Socket, private authService: AuthService, private chatService: ChatService) {
    this.socket.connect();
    this.sender = this.authService.getUsername();
    this.avatars = CHAT_AVATARS;
    this.url = GAY_URL;
    this.messageSound.volume = 0.2;
    this.notificationSound.volume = 0.2;
    this.requestNotificationPermission();
    this.socket.on('message', (msg: any) => {
      switch (msg['type']) {
        case 'media':
          this.scrollEpsilon = 450;
          this.messages.push({
            sender: msg['sender'], time: msg['time'], formattedTime: this.formatTime(msg['time']),
            path: msg['path'], name: msg['name'], type: msg['type'], fileType: msg['fileType']
          })
          if (msg['sender'] !== this.sender) {
            this.triggerNotification(msg['sender'] + ": " + '<Media>');
          }
          break;
        case 'user-message':
          if (this.socketLoading.has(msg['time'])) {
            this.socketLoading.set(msg['time'], false);
            this.messageSound.play();
          }
          else {
            this.scrollEpsilon = 110;
            this.messages.push({
              content: msg['content'], sender: msg['sender'], time: msg['time'],
              formattedTime: this.formatTime(msg['time']), type: msg['type']
            });
            this.triggerNotification(msg['sender'] + ": " + msg['content']);
          }
          break;
      }
    });

    // this.subscriptions.push(this.chatService.getMessages().subscribe((response) => {
    //   console.log(response);
    // }));

  }

  formatTime(time: number) {
    let date = new Date(time);
    return date.toLocaleString();
  }

  sendMessage() {
    if (this.content === '') return;
    let sender = this.sender;
    let time = (new Date()).getTime()
    this.time = time;
    let content = this.content;
    let media = null;
    let type = "user-message";
    this.socket.emit('message', { sender, time, content, media, type });
    this.socketLoading.set(this.time, true);
    this.scrollEpsilon = 110;
    this.messages.push({ content: this.content, sender: this.sender, time: this.time, formattedTime: this.formatTime(this.time), type: type });
    this.content = "";
  }

  uploadMedia() {
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    let file = fileInput!.files![0];
    const reader = new FileReader();

    reader.onload = () => {
      const buffer = reader.result as ArrayBuffer;
      const name = file?.name;
      const sender = this.sender;
      let date = new Date();
      let time = date.getTime();
      this.time = time;
      let month = date.toLocaleString('default', { month: 'long' }) + date.getFullYear();
      let type = 'media';
      let fileType = file?.type;
      this.socket.emit('message', { buffer, name, sender, time, month, type, fileType });
    };

    reader.readAsArrayBuffer(file);
  }

  shouldScroll() {
    let shouldScroll = Math.abs(
      (this.chatbox.nativeElement.scrollTop + this.chatbox.nativeElement.clientHeight)
      - this.chatbox.nativeElement.scrollHeight) < this.scrollEpsilon;
    return shouldScroll;
  }
  scroll() {
    this.chatbox.nativeElement.scrollTop = this.chatbox.nativeElement.scrollHeight;
  }

  ngOnDestroy() {
    this.socket.disconnect();
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  requestNotificationPermission() {
    if (Notification.permission === 'granted') return;
    if (Notification.permission === 'denied') return;
    Notification.requestPermission();
  }

  triggerNotification(msg: string) {
    if (!document.hasFocus() && Notification.permission === 'granted') {
      const notification = new Notification('You got a message Daddy :o', {
        body: msg,
        silent: true
      });
    };

    if (!document.hasFocus()) {
      this.notificationSound.play();
    }
  }

  ngAfterViewInit() {
    const observer = new MutationObserver((mutations) => {
      if (this.shouldScroll()) {
        this.scroll();
      }
    });
    const config = { childList: true };
    observer.observe(this.chatbox.nativeElement, config);
  }

}
