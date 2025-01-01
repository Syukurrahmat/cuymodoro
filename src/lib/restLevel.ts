import moment from "moment";

export const LOCALSTORAGE_RESTLEVEL_KEY = 'rest-level';

const RestLevel = {
	levelList: [
		{ value: 'beginner', label: 'Pemula', percentage: 0.35 },
		{ value: 'regular', label: 'Reguler', percentage: 0.28 },
		{ value: 'enthusiast', label: 'Mahir', percentage: 0.2 },
	],

	getRestTime(start: Date, end: Date) {
		const restPercentage = this.levelList.find((e) => e.value == JSON.parse(localStorage.getItem(LOCALSTORAGE_RESTLEVEL_KEY) || ''))?.percentage || 0

		return moment.duration(moment(end).diff(start)).asSeconds() * restPercentage
	},
};

export default RestLevel