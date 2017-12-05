import { SafeResourceUrl } from '@angular/platform-browser';

export class comment {
	date: string;
	author: string;
	name: string;
	id: number;
	content: string;
	editing: boolean;
}

export class article {
	_id: number;
	text: string;
	editing: boolean;
	colspan: number;
	date: string;
	img: SafeResourceUrl;
	comments: comment[];
	author: string;
	name: string;
	comment: string;
}