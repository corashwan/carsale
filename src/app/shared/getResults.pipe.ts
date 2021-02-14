import {Pipe , PipeTransform} from '@angular/core';


@Pipe({name:'getResults'})


export class GetResults implements PipeTransform{
   constructor(){}
   transform(value:any): any {
    return value.results
   }
}