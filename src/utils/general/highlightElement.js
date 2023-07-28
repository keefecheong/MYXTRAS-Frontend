// to highlight element for 5s (mainly for routing from admin panel (reports) to actual resource)

export default function highlightElement(element) {
    element.style.backgroundColor = `rgba(226, 34, 98, 0.1)`;

    setTimeout(() => {
        element.style.backgroundColor = '';
    }, 5000);
}