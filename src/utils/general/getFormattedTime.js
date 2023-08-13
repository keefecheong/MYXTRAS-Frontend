// to return formatted date time string

export default function getFormattedTime(timeString) {
    return new Date(timeString).toLocaleString([], {
        dateStyle: "medium",
        timeStyle: "medium",
    });
}
