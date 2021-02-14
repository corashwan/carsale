import { Component } from '@angular/core';
import { LanguagesService } from './shared/services/languages/languages.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'project';
  lang = this.langService.language
  constructor(public langService:LanguagesService,){

  }
}
