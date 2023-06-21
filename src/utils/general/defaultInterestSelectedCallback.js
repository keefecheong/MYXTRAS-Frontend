export default function handleInterestSelected(option, selectedOption) {
    const index = selectedOption.indexOf(option);
    if (index != -1) {
        // if option is already selected, remove it from the array
        selectedOption.splice(index, 1);
    } else {
        // otherwise add it to the array
        selectedOption.push(option);
    }
}