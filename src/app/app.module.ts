import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { LoginComponent } from './views/login/login.component';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslatePipe } from './core/translate.pipe';
import { LoginService } from './core/login.service';
import { GameFormComponent } from './views/game-form/game-form.component';
import { GameBoardComponent } from './views/game-board/game-board.component';

@NgModule({
  declarations: [AppComponent, TranslatePipe, LoginComponent, GameFormComponent, GameBoardComponent],
  imports: [
    BrowserModule,
    FormsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
    BrowserAnimationsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatCardModule,
    MatSelectModule,
    MatDialogModule,

  ],
  providers: [LoginService],
  bootstrap: [AppComponent],
})
export class AppModule {}
