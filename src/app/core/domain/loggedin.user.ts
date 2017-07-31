export class LoggedInUser {
   
    constructor(id: string, access_token: string, uesrname: string, fullname: string, email: string, avatar: string, roles: any) {
        this.id = id;
        this.access_token = access_token;
        this.fullname = fullname;
        this.username = uesrname;
        this.email = email;
        this.avatar = avatar;
        this.roles = roles;
      
    }

    public id: string;
    public access_token: string;
    public username: string;
    public fullname: string;
    public email: string;
    public avatar: string;
    public roles: any;
}