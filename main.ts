import { Plugin } from 'obsidian';
import { getAPI as getDataviewAPI } from "obsidian-dataview";
const { remote } = require('electron');

export default class TaskCount extends Plugin {
	async onload() {
		this.registerInterval(window.setInterval(this.getSearch, 20000));
		remote.app.dock.setBadge('');
		setTimeout(this.getSearch, 2000);
	}
	async onunload() {
		remote.app.dock.setBadge('')
	}
	async getSearch() {
		console.log('start');
		const dataviewApi = getDataviewAPI();
		console.log('got api');
		const taskQuery = `TABLE Tasks.path, Tasks.status
		WHERE file.tasks
		FLATTEN file.tasks AS Tasks
		WHERE Tasks.text != "" AND !contains(Tasks.path, "TPL") AND !Tasks.completed AND Tasks.status != "-" AND (Tasks.due = null OR date(Tasks.due) < date("tomorrow"))`;
		dataviewApi.tryQuery(taskQuery).then((dataviewResults: any) => {
			console.log('got results', dataviewResults);
			remote.app.dock.setBadge(dataviewResults.values.length > 0 ? dataviewResults.values.length.toString() : '');
			console.log('set badge');
		});

	}
}
