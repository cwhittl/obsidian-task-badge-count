import { Plugin } from 'obsidian';
import { getAPI as getDataviewAPI } from "obsidian-dataview";
const { remote } = require('electron');

export default class TaskCount extends Plugin {
	intervalTime: number = 60000;
	firstBlood: number = 5000;

	public static setBadge(badgeText: string) {
		remote.app.dock.setBadge(badgeText)
	}
	public static clearBadge() {
		TaskCount.setBadge('');
	}
	async onload() {
		TaskCount.clearBadge();
		setTimeout(this.getSearch, this.firstBlood);
		this.registerInterval(window.setInterval(this.getSearch, this.intervalTime));
	}
	async onunload() {
		TaskCount.clearBadge();
	}
	async getSearch() {
		const dataviewApi = getDataviewAPI();
		const taskQuery = `TABLE Tasks.path, Tasks.status
		WHERE file.tasks
		FLATTEN file.tasks AS Tasks
		WHERE Tasks.text != "" AND !contains(Tasks.path, "TPL") AND !Tasks.completed AND Tasks.status != "-" AND (Tasks.due = null OR date(Tasks.due) < date("tomorrow"))`;
		var queryStart = new Date();
		dataviewApi.tryQuery(taskQuery).then((dataviewResults: any) => {
			var queryEnd = new Date();
			var secondsRan = (queryEnd.getTime() - queryStart.getTime()) / 1000;
			console.log(`took ${secondsRan} to get the data back`);
			TaskCount.setBadge(dataviewResults.values.length > 0 ? dataviewResults.values.length.toString() : '');
		});
	}
}
