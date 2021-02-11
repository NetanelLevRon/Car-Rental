import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Email } from "../models/email.model";


@Injectable()
export class EmailService {
    
    private link = "http://localhost:53312/api/email/send-email";
    public email: Email = new Email();
    public errMsg: string;

    constructor(private myHttpClient: HttpClient) { }
    
        //Post : send the email 
        sendMail(email: Email, callback: (bool: boolean) => void): void {
            this.myHttpClient.post<boolean>(this.link, JSON.stringify(email),
                { headers: { "content-type": "application/json" } }).subscribe(() => { callback(true); },
                    (err: HttpErrorResponse) => {
                        this.errMsg = err.error;
                        console.log(this.errMsg); callback(false)
                    });
        }
        
}