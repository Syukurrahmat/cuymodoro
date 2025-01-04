export function durationToHHMMSS(duration: moment.Duration, hiddenHourIfZero = true) {
    const hours = Math.floor(duration.asHours());

    const hh = String(hours).padStart(2, '0');
    const mm = String(duration.minutes()).padStart(2, '0');
    const ss = String(duration.seconds()).padStart(2, '0');

    return hiddenHourIfZero && hours <= 0 ? `${mm}:${ss}` : `${hh}:${mm}:${ss}`
}

