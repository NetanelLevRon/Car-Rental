import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/services/user.service';
import { EmailService } from '../shared/services/email.service';
import { Email } from '../shared/models/email.model';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  constructor(private _userService: UserService, private _emailService: EmailService) { }

  public emailModel: Email = new Email();
  public subject: string;
  public senderMail: string;
  public message: string;
  public errMsg: string;
  public emailAnswer: string;

  OnSubmit() {
    if (this._userService.validateEmail(this.senderMail)) {
      this.errMsg = "";
      this.emailAnswer = "";

      let callback = (bool: boolean) => { this.emailAnswer = (bool) ? "successfuly sended" : "not sended"; };

      this.emailModel.senderMail = this.senderMail;
      this.emailModel.subject = this.subject;
      this.emailModel.message = this.message;

      this._emailService.sendMail(this.emailModel, callback);

      this.alertEmailAnswer();

    }
    else {
      this.errMsg = "incorrect email syntax!";
    }
  }

  alertEmailAnswer() {
    setTimeout(() => {
      if (this.emailAnswer) {
        let alertMessage: string = this._emailService.errMsg? this.emailAnswer + "!\n" + this._emailService.errMsg: this.emailAnswer; 
        alert(alertMessage);
        this.subject = "";
        this.senderMail = "";
        this.message = "";
      }
      else {
        this.alertEmailAnswer();
      }

    }, 1000)
  }

  ngOnInit() {
  }

}
