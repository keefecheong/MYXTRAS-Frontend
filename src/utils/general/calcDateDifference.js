// calculates the time/date difference between given time and current time and express as a string
export default function calcDateDifference(givenTimeString) {
    const givenDatetime = new Date(givenTimeString);
    const currentDatetime = new Date();

    let result;

    const timeDifference = currentDatetime.getTime() - givenDatetime.getTime();
    const dayDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    if (dayDifference == 0) {
        result = 'Today';
    }
    else if (dayDifference == 1) {
        result = 'Yesterday';
    }
    else if (dayDifference < 30) {
        result = `${dayDifference} days ago`;
    }
    else {
        const monthDifference = Math.floor(dayDifference / 30);

        if (monthDifference < 12) {
            result = `${monthDifference} month${monthDifference > 1 ? 's' : ''} ago`;
        }
        else {
            const yearDifference = Math.floor(monthDifference / 12);
            result = `${yearDifference} year${yearDifference > 1 ? 's' : ''} ago`;
        }
    }

    return result;
}