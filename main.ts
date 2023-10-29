import { App, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { getAPI as getDataviewAPI } from "obsidian-dataview";

// async function getSearch(app) {
// 	const taskQuery = `tasks not done due today path does not include 50 Resources  group by path sort by priority sort by path hide due date `;
// 	app.internalPlugins.plugins['global-search'].instance.openGlobalSearch(taskQuery);
// 	const searchLeaf = app.workspace.getLeavesOfType('search')[0];
// 	const search = await searchLeaf.open(searchLeaf.view);
// 	return await new Promise(resolve => setTimeout(() => {
// 		var count = search.dom.resultDomLookup.size;
// 		//console.log(count > 0 ? count : '');
// 		electron.remote.app.dock.setBadge(count > 0 ? count.toString() : '')
// 		resolve(2);

// 	}, 300)); // the delay here was specified in 'obsidian-text-expand' plugin; I assume they had a reason   
// }


export default class TaskCount extends Plugin {
	async onload() {
		electron.remote.app.dock.setBadge('');
		getSearch();
		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => this.getSearch(), 5000));
	}
	async onunload() {
		electron.remote.app.dock.setBadge('')
	}
	async getSearch() {
		const dataviewApi = getDataviewAPI();
		const taskQuery = `TABLE WITHOUT ID Tasks.path
		WHERE file.tasks
		FLATTEN file.tasks AS Tasks
		WHERE Tasks.text != "" AND !contains(Tasks.path, "TPL") AND !Tasks.completed AND (Tasks.due = null OR date(Tasks.due) < date("tomorrow"))`;
		var dataviewResults = await dataviewApi.tryQuery(taskQuery);
		//console.log(dataviewResults);
		electron.remote.app.dock.setBadge(dataviewResults.values.length > 0 ? dataviewResults.values.length.toString() : '')
		dataviewResults = null;
	}
}
