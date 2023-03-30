import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { GW_SENDERS, GW_IMAGES_MAP } from 'src/constants/constants';
import { AuthService } from 'src/services/auth.service';
import { GuessWhoService } from 'src/services/guess-who.service';


@Component({
  selector: 'app-guess-who',
  templateUrl: './guess-who.component.html',
  styleUrls: ['./guess-who.component.scss']
})
export class GuessWhoComponent implements OnDestroy {
  started: boolean = false;
  roundNumber: number = 1;
  senders: string[];
  health: number = 100;
  messagesLoaded: boolean = false;
  messages: any;
  subscriptions: Subscription[] = [];
  cacheSize: number = 50;
  currentMessage: string = "";
  currentSender: string = "";
  images: object;
  gameOver: boolean = false;
  wrongSet: Set<string> = new Set();
  wrongPerson: string = "";
  correctAnswer: string = "";
  score: number = 0;
  roundScore: number = 0;

  constructor(private guessWhoService: GuessWhoService, private authService: AuthService) {
    this.images = GW_IMAGES_MAP;
    this.senders = GW_SENDERS;
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    })
  }
  startGame() {
    this.started = true;
    this.subscriptions.push(
      this.guessWhoService.getMessages(this.cacheSize, 15, this.senders).subscribe((messages) => {
        this.messages = messages;
        this.messagesLoaded = true;
        this.gameOver = false;
        this.roundNumber = 1;
        this.startRound();
      })
    )
  }
  removePlayer(player: string) {
    if (this.senders.length <= 2) return;
    delete (this.images as any)[player]
    this.senders = this.senders.filter((sender) => sender != player);
  }

  startRound() {
    this.health = 100;
    const randomPerson = Math.floor(Math.random() * this.messages.length);
    const personMessages = this.messages[randomPerson];
    const randomIndex = Math.floor(Math.random() * personMessages.length);
    let game = document.getElementById('game');
    if (game) {
      game.classList.remove("question")
      game.offsetWidth
      game.classList.add("question")
    }
    this.currentMessage = personMessages[randomIndex][1];
    this.currentSender = personMessages[randomIndex][2];
    this.wrongSet = new Set();
    this.roundScore = (this.senders.length / 2) >> 0;
    if (this.roundNumber % 12 == 0) {
      this.messagesLoaded = false;
      this.subscriptions.push(
        this.guessWhoService.getMessages(this.cacheSize, 15, this.senders).subscribe((messages) => {
          this.messages = messages
          this.messagesLoaded = true;
        })
      )
    }
  }
  userResponse(guess: string) {
    if (guess === this.currentSender) {
      this.roundNumber++;
      this.score += this.roundScore;
      this.startRound();
    }
    else {
      this.wrongSet.add(guess);
      this.roundScore--;
      this.wrongPerson = guess;
      const strikes = (this.senders.length / 2) >> 0
      this.health = ((strikes - this.wrongSet.size) / strikes) * 100

      if (this.wrongSet.size === strikes) {
        this.gameOver = true;
        this.correctAnswer = this.images[this.currentSender as keyof object];
        let game = this.senders.length >= 10 ? "guess-who-large" : "guess-who-medium";
        if (game === "guess-who-medium") {
          game = this.senders.length >= 6 ? "guess-who-medium" : "guess-who-small";
        }
        this.subscriptions.push(
          this.guessWhoService.postScore(
            this.authService.getUsername(), this.score, game)
            .subscribe((response) => {
            }));
        this.score = 0;
      }
    }

  }

  playAgain() {
    this.wrongSet = new Set();
    this.messages = [];
    this.messagesLoaded = false;
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.subscriptions = [];
    this.startGame();
  }

}
