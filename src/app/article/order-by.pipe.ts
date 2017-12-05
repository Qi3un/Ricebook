import { Pipe, PipeTransform } from '@angular/core';
import { article } from './article';

@Pipe({
  name: 'orderBy'
})
export class OrderByPipe implements PipeTransform {

  transform(array: Array<article>, args: article): Array<article> {
	  if(!array || array === undefined || array.length === 0) return null;

	    array.sort((a: any, b: any) => {
	      if (a.date > b.date) {
	        return -1;
	      } else if (a.date < b.date) {
	        return 1;
	      } else {
	        return 0;
	      }
	    });
	    return array;
  }

}
