type TimeUnit =	'year' | 'quarter' | 'month' | 'week' | 'day' | 'hour' | 'minute' | 'second';

export function dateAdd(date: Date, unit: TimeUnit, count: number): Date {
	let ret = new Date(date); //don't change original date
	switch (unit) {
		case 'year': ret.setFullYear(ret.getFullYear() + count); break;
		case 'quarter': ret.setMonth(ret.getMonth() + 3 * count); break;
		case 'month': ret.setMonth(ret.getMonth() + count); break;
		case 'week': ret.setDate(ret.getDate() + 7 * count); break;
		case 'day': ret.setDate(ret.getDate() + count); break;
		case 'hour': ret.setTime(ret.getTime() + count * 3600000); break;
		case 'minute': ret.setTime(ret.getTime() + count * 60000); break;
		case 'second': ret.setTime(ret.getTime() + count * 1000); break;
		default: ret = undefined; break;
	}
	return ret;
}