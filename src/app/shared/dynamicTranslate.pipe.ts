import {Pipe , PipeTransform} from '@angular/core';


@Pipe({name:'dynamicTranslate'})


export class DynamicTranslate implements PipeTransform{
  //   language = localStorage.getItem('lang') ? localStorage.getItem('lang') : 'en';
  //  ar = this.language == 'en' ? false : true;
   constructor(){}
   transform(value:any,lang:string,en:string,ar:string): any {
       if(lang == 'en'){
        return value[en]
       }else {
        return value[ar]
       }
   }
}
