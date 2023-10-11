class User{
    public name: string | undefined;
    public password: string | undefined;


    constructor(name: string, password : string){
        this.name = name;
        this.password = password;
        
    }
}

export default User;