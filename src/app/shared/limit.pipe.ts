import {Pipe , PipeTransform} from '@angular/core';


@Pipe({name:'limit'})


export class Limit implements PipeTransform{
   constructor(){}
   transform(value:any,start:Number,end:Number,showMore:boolean): any {
      if(showMore == true ){
         return value
      } else {
         return  value.slice(start,end)
      }
   }
}