import {Pipe , PipeTransform} from '@angular/core'

import {LanguagesService} from './services/languages/languages.service'


@Pipe({name:'translate'})

export class Translate implements PipeTransform{
   get language(){ return this.translate.language };
  //  ar = this.language == 'en' ? false : true;
   constructor( public translate:LanguagesService){}
   content = this.translate.content
   transform(value:any,lang:string): any {
      if(lang == 'ar'){
         return this.content[value];
      } else {
         return value
      }
    }
}
