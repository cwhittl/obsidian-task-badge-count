import { Plugin } from 'obsidian';
import { getAPI as getDataviewAPI } from "obsidian-dataview";

export default class TaskCount extends Plugin {
	intervalTime: number = 10000;
	firstBlood: number = 2000;

	public static setBadge(badgeText: string) {
		try {
			//OSX 
			const { remote } = require('electron');
			remote.app.dock.setBadge(badgeText);
		} catch (error) {
			//NOT OSX
			//TODO Add options for IOS/Android/Windows
		}
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
		const taskQuery = `TASK WHERE !completed AND text != "" AND status != "-" AND (due = null OR date(due) < date("tomorrow")) AND !contains(path, "TPL")`;
		var queryStart = new Date();
		dataviewApi.tryQuery(taskQuery).then((dataviewResults: any) => {
			var queryEnd = new Date();
			var secondsRan = (queryEnd.getTime() - queryStart.getTime()) / 1000;
			console.log(`took ${secondsRan} to get the data back`);
			TaskCount.setBadge(dataviewResults.values.length > 0 ? dataviewResults.values.length.toString() : '');
		})
	}
}
