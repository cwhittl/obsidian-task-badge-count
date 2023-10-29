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
		const dataviewApi = getDataviewAPI();
		const taskQuery = `TABLE Tasks.path
		WHERE file.tasks
		FLATTEN file.tasks AS Tasks
		WHERE Tasks.text != "" AND !contains(Tasks.path, "TPL") AND !Tasks.completed AND (Tasks.due = null OR date(Tasks.due) < date("tomorrow"))`;
		var dataviewResults = await dataviewApi.tryQuery(taskQuery);
		remote.app.dock.setBadge(dataviewResults.values.length > 0 ? dataviewResults.values.length.toString() : '')
	}
}
