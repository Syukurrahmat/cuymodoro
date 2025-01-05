/* eslint-disable react-hooks/exhaustive-deps */
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import { durationToHHMMSS } from '../lib/utils';

export function useStopwatch(startTime: Date) {
	const getDuration = () => moment.duration(moment().diff(startTime));
	const [duration, setDuration] = useState(getDuration);

	useEffect(() => {
		const interval = setInterval(() => setDuration(getDuration()), 1000);
		const intervalNotif = setInterval(() => {
			// const text = `HEY! Your task "${'ssssisj'}" is now overdue.`;
			// const notification = new Notification("To do list", { body: text})
			// alert('ejeje')
		}, 10000);
		return () => {
			clearInterval(interval)
			clearInterval(intervalNotif)
		}
	}, []);

	return {
		duration,
		durationStr: duration ? durationToHHMMSS(duration) : undefined,
	};
}

export function useTimer(startTime: Date, duration: number, onEnd: () => any) {
	const endTime = moment(startTime).add(duration, 's').toDate()
	const interval = useRef<number | null>(null)

	const getRemaining = () => {
		const rem = moment.duration(moment(endTime).diff(moment()));
		const second = rem.asSeconds()
		if (second <= 0 && interval.current) {
			onEnd();
			clearInterval(interval.current);
			interval.current = null
		}
		return second > 0 ? rem : moment.duration(0)
	};

	const [remaining, setRemaining] = useState(getRemaining());

	useEffect(() => {
		console.log('=====')
		interval.current = setInterval(() => setRemaining(getRemaining()), 100);
		return () => {
			if (interval.current) clearInterval(interval.current);
		}
	}, []);

	return {
		remaining,
		remainingStr: remaining ? durationToHHMMSS(remaining) : undefined,
	};
}
