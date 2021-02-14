import {Pipe , PipeTransform} from '@angular/core';


@Pipe({name:'filter'})


export class Filter implements PipeTransform{
   constructor(){}
   transform(value:any,filter:Number,key:string): any {
       console.log('filter => '+filter)
       if(filter != undefined){
            return value.filter( val => {return val[key] == filter == true})
       } else {
            return value
       }
   }
}