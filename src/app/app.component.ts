import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { User } from './core/models/user.model';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from './views/login/login.component';
import { colors } from './core/models/color.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'amoba-pwa';
  isLoggedIn = false;
  started = false;

  rows = Array();
  columns = Array();
  formGroup: FormGroup;
  size = 10;
  colors = colors;
  symbols = ['o', 'x', '_'];

  usersCount: number = 2;
  users = Array<User>(this.usersCount);
  userIndex = 0;

  table: User[][] = [];

  nextUser: string;
  clickCount = 0;
  win = false;
  draw = false;

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    const dialogRef = this.dialog.open(LoginComponent, { disableClose: true });
    dialogRef.afterClosed().subscribe((result) => {
      this.isLoggedIn = true;
    });

    this.formGroup = new FormGroup({
      size: new FormControl(this.size),
      usersCount: new FormControl(this.usersCount, [
        Validators.min(2),
        Validators.max(6),
      ]),
    });

    this.initializeUsers(this.usersCount);
    this.initializeFormControls();
  }

  initializeUsers(event: number) {
    this.usersCount = event;
    this.users = [];
    this.users = Array<User>(this.usersCount);
    for (let i = 0; i < this.usersCount; i++) {
      this.users[i] = {
        name: i + 1 + '. Játékos',
        color: this.colors[i],
        symbol: this.symbols[i % 2 === 0 ? 0 : 1],
        availableColors: [],
      };
    }
    for (let i = 0; i < this.usersCount; i++) {
      this.users[i].availableColors = this.getAvailableColors(i);
    }
  }

  initializeFormControls() {
    for (let i = 0; i < this.usersCount; i++) {
      this.formGroup.addControl(
        'user' + i + 'name',
        new FormControl(this.users[i].name, Validators.required)
      );
      this.formGroup.addControl(
        'user' + i + 'color',
        new FormControl(this.users[i].color, Validators.required)
      );
      this.formGroup.addControl(
        'user' + i + 'symbol',
        new FormControl(this.users[i].symbol, Validators.required)
      );
    }
    Object.keys(this.formGroup.controls).forEach((controlName) => {
      const control = this.formGroup.get(controlName);
      control?.valueChanges.subscribe((res) => {
        this.handleFormValueChanges(controlName, res);
      });
    });
  }

  handleFormValueChanges(controlName: string, value: any) {
    if (controlName === 'usersCount') {
      this.initializeUsers(value);
      this.initializeFormControls();
      return;
    }

    const userIndex = Number(controlName[4]);
    const prop = controlName.slice(5);
    switch (prop) {
      case 'name': {
        for (let i = 0; i < this.usersCount; i++) {
          if (i !== userIndex && this.users[i].name === value) {
            this.formGroup.get(controlName)?.setErrors({ invalid: true });
          }
        }
        break;
      }
      case 'color': {
        this.users[userIndex].color = value;
        this.users.forEach((user) => {
          for (let i = 0; i < this.usersCount; i++) {
            if (i !== userIndex) {
              this.users[i].availableColors = this.getAvailableColors(i);
            }
          }
        });
        break;
      }
    }
  }

  getAvailableColors(userIndex: number) {
    let reservedColors: string[] = [];
    this.users.forEach((user, i) => {
      if (i !== userIndex) {
        reservedColors.push(user.color);
      }
    });

    const availableColors = this.colors.filter((color) => {
      return !reservedColors.includes(color);
    });

    return availableColors;
  }

  initializeTable() {
    this.table = [];
    for (let i = 0; i < this.size; i++) {
      const row: User[] = [];
      for (let j = 0; j < this.size; j++) {
        const emptyUser: User = {
          name: '',
          color: '',
          symbol: this.symbols[2],
          availableColors: [],
        };
        row.push(emptyUser);
      }
      this.table.push(row);
    }
  }

  onStart() {
    this.size = this.formGroup.controls['size'].value;
    this.rows = Array(this.size);
    this.columns = Array(this.size);

    const formValues = this.formGroup.value;
    this.users.forEach((user, i) => {
      user.name = formValues['user' + i + 'name'];
      user.color = formValues['user' + i + 'color'];
      user.symbol = formValues['user' + i + 'symbol'];
    });

    this.resetGame();
    this.started = true;
  }

  onStop() {
    this.resetGame();
    this.started = false;
  }

  onClick(event: any) {
    if (this.win || this.draw) {
      return;
    }
    if (this.table[event.row][event.column].symbol !== this.symbols[2]) {
      return;
    }
    const user = this.users[this.userIndex];
    this.table[event.row][event.column] = user;

    if (this.checkWin(event.row, event.column)) {
      this.win = true;
      this.started = false;
      return;
    }
    if (this.checkDraw()) {
      this.draw = true;
      this.started = false;
      return;
    }

    this.userIndex++;
    if (this.userIndex >= this.usersCount) {
      this.userIndex = 0;
    }
    this.nextUser = this.users[this.userIndex].name;
  }

  resetGame() {
    this.initializeTable();
    this.win = false;
    this.draw = false;
    this.clickCount = 0;
    this.userIndex = 0;
    this.nextUser = this.users[this.userIndex].name;
  }

  checkWin(row: number, column: number) {
    const steps = [
      { h: -1, v: -1 },
      { h: -1, v: 0 },
      { h: -1, v: 1 },
      { h: 0, v: -1 },
    ];
    for (let step of steps) {
      const verifiedCell = { row: row, column: column };
      let prefix = 1;
      let sum = 1;
      for (let i = 1; i <= 5; i++) {
        verifiedCell.row = verifiedCell.row + prefix * step.h;
        verifiedCell.column = verifiedCell.column + prefix * step.v;

        if (
          verifiedCell.row >= 0 &&
          verifiedCell.row < this.size &&
          verifiedCell.column >= 0 &&
          verifiedCell.column < this.size &&
          this.table[verifiedCell.row][verifiedCell.column].name ===
            this.table[row][column].name
        ) {
          sum++;
        } else {
          if (prefix === -1) {
            break;
          }
          verifiedCell.row = row;
          verifiedCell.column = column;
          prefix = -1;
        }
      }
      if (sum === 5) {
        return true;
      }
    }
    return false;
  }

  checkDraw() {
    this.clickCount++;
    if (this.clickCount === this.size ** 2) {
      return true;
    } else {
      return false;
    }
  }

  onRestart() {
    this.resetGame();
    this.started = true;
  }
}
