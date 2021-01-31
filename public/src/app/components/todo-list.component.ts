const selector = 'todo-list';

export enum TodoListItemStates {
	ADDED,
	IN_PROGRESS,
	DROPPED,
	FINISHED,
	BACK_BURNER
}

export type TodoListSection = {
	id : string | number;
	name : string;
};

export type TodoListItem = {
	value : string;
	state : number;
	progress : number;
	dynamicTranslation? : boolean;
	hasSubsection? : boolean;
	sectionId ?: string | number;
};

export type TodoListData = {
	sections ?: TodoListSection;
	data : TodoListItem[];
}

export default class TodoListComponent {
	sections?: TodoListSection;
	items: TodoListItem[];
	constructor () {

	}
	addData ( value : TodoListData ) {

	}
	addItem(value:TodoListItem) {

	}
}
