import {Pipe , PipeTransform} from '@angular/core';


@Pipe({name:'loadMoreAds'})


export class LoadMoreAds implements PipeTransform{
   constructor(){}
   transform(value:any,page,count): any {
        return  value.slice(0,page*count)
   }
}