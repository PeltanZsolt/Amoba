export class LoginService {
  userList = [
    {
      username: 'Felhasználó1',
      password: 'jelszó1',
    },
    {
      username: 'Felhasználó2',
      password: 'jelszó2',
    },
    {
      username: 'Felhasználó3',
      password: 'jelszó3',
    },
    {
      username: 'Felhasználó4',
      password: 'jelszó4',
    },
    {
      username: 'Felhasználó5',
      password: 'jelszó5',
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
