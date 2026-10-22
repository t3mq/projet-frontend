import { useEffect, useState } from "react";
import { secondsUntilParisMidnight, formatCountdown } from "../logic/time.js";

export default function Countdown() {
    const [seconds, setSeconds] = useState(() => secondsUntilParisMidnight(new Date()));

    useEffect(() => {
        const id = setInterval(() => {
            setSeconds(secondsUntilParisMidnight(new Date()));
        }, 1000);
        return () => clearInterval(id);
    }, []);
    return (
        <p className="text-center">
            Porchain mot dans <strong className="font-mono">{formatCountdown(seconds)}</strong>
        </p>
    )
}