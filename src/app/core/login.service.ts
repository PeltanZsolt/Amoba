export class LoginService {
  userList = [
    {
      username: 'Felhasználó1',
      password: 'jelszó1',
    },
  ];

  checkCredentials(username: string, password: string) {
    for (let user of this.userList) {
      if (user.username === username && user.password === password) {
        return true;
      }
    }
    return false;
  }
}
