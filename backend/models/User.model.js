class User {
    constructor(email, lastname, firstname, password, isAdmin) {
        this.email = email;
        this.lastname = lastname;
        this.firstname = firstname;
        this.password = password;
        this.isAdmin = isAdmin;
    }
};

module.exports = User;


