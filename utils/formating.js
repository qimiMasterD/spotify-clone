function formatNumberIntl(num) {
    return new Intl.NumberFormat("en-US").format(num);
}

function formatSeconds(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);

    const paddedSeconds = String(seconds).padStart(2, "0");

    return `${minutes}:${paddedSeconds}`;
}

export { formatNumberIntl, formatSeconds };
