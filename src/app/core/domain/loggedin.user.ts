export class LoggedInUser {
    constructor(access_token: string, uesrname: string, fullname: string, email: string, avatar: string) {
        this.access_token = access_token;
        this.fullname = fullname;
        this.username = uesrname;
        this.email = email;
        this.avatar = avatar;
    }
    public id: string;
    public access_token: string;
    public username: string;
    public fullname: string;
    public email: string;
    public avatar: string;
}