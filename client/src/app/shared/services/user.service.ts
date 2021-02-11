import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { User } from "../models/user.model";
import { UserStore } from "../models/user-store.model";


@Injectable()
export class UserService {

    private link = "http://localhost:53312/api/User";
    public urlPrefix: string = "http://localhost:53312/Image/";
    public user: User = new User();
    public userForEdit: User = new User();
    public userRole: string;
    public isLogedOut: boolean = false;
    public isLogedIn: boolean = false;
    public errMsg: string[] = new Array<string>();
    public userInfo: UserStore = new UserStore();

    constructor(private myHttpClient: HttpClient) { }

    onInit() {
        this.defaultUser();
    }

    /** 
     * return true if the email syntax correct
    */
    validateEmail(email: string) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    defaultUser() { // after logout
        this.user = new User();
        this.user.UserRole = "guest";
        this.user.Image = "../assets/images/defaultUserPic.png";
        this.isLogedOut = true;
        this.isLogedIn = false;
        console.log("from service user.userRole: " + this.user.UserRole)
    }

    userRegitred() { // after register update the header
        this.user.Image = this.urlPrefix + this.user.Image;
    }

    //GET : get all Users from server (and save the returned value to a property in this service)
    getUsers(): Array<User> {
        this.myHttpClient.get(this.link)
            .subscribe((x: Array<User>) => { Object.assign(this.userInfo.userList = x); },
                (err: HttpErrorResponse) => { console.log("err : " + err); },
                () => { console.log("from user service this.userInfo.userList[0].FullName = " + this.userInfo.userList[0].FullName); }
            );
        return this.userInfo.userList;
    }

    getUser(id: number, uName: string, psw: string): User { // for edited perpesess // access only by admin
        this.myHttpClient.get(`${this.link}?id=${id}`, { headers: { "Authorization": `${uName} ${psw}` } })
            .subscribe((x: User) => { Object.assign(this.userForEdit, x); },
                (err: HttpErrorResponse) => { console.log(err); },
                () => { console.log("%c from sevice: " + this.user.FullName, 'bacground: brown') });
        return this.user;
    }

    //GET : get the login user (and set his 'user name' and 'password' for next authorization on the server) from server (and save the returned value to a property in this service)
    getLoginUser(uName: string, psw: string): User {
        this.myHttpClient.get(`${this.link}/GetLogin`, { headers: { "Authorization": `${uName} ${psw}` } })
            .subscribe((x: User) => { Object.assign(this.user, x); this.isLogedIn = true; },
                (err: HttpErrorResponse) => { this.errMsg = new Array<string>(); this.errMsg[0] = err.statusText; console.log(err); });
        return this.user;
    }

    deleteUser(id: number, callback: (bool: boolean) => void, uName: string, psw: string): void { // access only by admin
        this.myHttpClient.delete<boolean>(`${this.link}?id=${id}`, { headers: { "Authorization": `${uName} ${psw}` } }).subscribe(() => { callback(true); }, // לא עובד 'next' if everything gose fine -> get last user that updated (ths string "done" operate the GET method that gets string)
            (err: HttpErrorResponse) => {
                this.errMsg[0] = err.error;
                console.log(err); callback(false)
            });
    }

    //Post : add new user by register
    addUser(user: User, callback: (bool: boolean) => void): void {
        this.myHttpClient.post<boolean>(this.link, JSON.stringify(user),
            { headers: { "content-type": "application/json" } }).subscribe(() => { callback(true); },
                (err: HttpErrorResponse) => {
                    this.errMsg = err.error;
                    console.log(err); callback(false)
                });
    }

    editUser(user: User, id: number, callback: (bool: boolean) => void, uName: string, psw: string): void { // access by admin
        this.myHttpClient.put<boolean>(`${this.link}?id=${id}`, JSON.stringify(user),
            { headers: { "content-type": "application/json", "Authorization": `${uName} ${psw}` } }).subscribe(() => { this.getUsers(); callback(true); },
                (err: HttpErrorResponse) => { this.errMsg = err.error; console.log(err); callback(false); });
    }

}