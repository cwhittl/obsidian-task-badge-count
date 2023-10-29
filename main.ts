import { App, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { getAPI as getDataviewAPI } from "obsidian-dataview";
const { remote } = require('electron')

export default class TaskCount extends Plugin {
	async onload() {
		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => this.getSearch(), 5000));
		remote.app.dock.setBadge('');
		this.getSearch();

	}
	async onunload() {
		remote.app.dock.setBadge('')
	}
	async getSearch() {
		const dataviewApi = getDataviewAPI();
		const taskQuery = `TABLE WITHOUT ID Tasks.path
		WHERE file.tasks
		FLATTEN file.tasks AS Tasks
		WHERE Tasks.text != "" AND !contains(Tasks.path, "TPL") AND !Tasks.completed AND (Tasks.due = null OR date(Tasks.due) < date("tomorrow"))`;
		var dataviewResults = await dataviewApi.tryQuery(taskQuery);

		remote.app.dock.setBadge(dataviewResults.values.length > 0 ? dataviewResults.values.length.toString() : '')
		dataviewResults = null;
	}
}
