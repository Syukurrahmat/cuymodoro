import { useEffect, useState } from "react";
import { useLoaderData } from "react-router-dom";

export function useFetchCallback<T>(cb: () => Promise<T>) {
    const [isloading, setIsloading] = useState(true);
    const [error, setError] = useState<any>();
    const [data, setData] = useState<T>();

    useEffect(() => {
        cb()
            .then(setData)
            .catch(setError)
            .finally(() => setIsloading(false));
    }, [cb])

    return { data, setData, isloading, error };
}

export function durationToHHMMSS(duration: moment.Duration, hiddenHourIfZero = false) {
    const hours = Math.floor(duration.asHours());

    const hh = String(hours).padStart(2, '0'); //prettier-ignore
    const mm = String(duration.minutes()).padStart(2, '0');
    const ss = String(duration.seconds()).padStart(2, '0');

    return hiddenHourIfZero && hours <= 0 ? `${mm}:${ss}` : `${hh}:${mm}:${ss}`
}

export function useLoaderDataTyped<T extends (...args: any[]) => any>() {
    return useLoaderData() as Awaited<ReturnType<T>>;
}
