export class comment {
	date: string;
	author: string;
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
	img: string;
	comments: comment[];
	author: string;
	comment: string;
}