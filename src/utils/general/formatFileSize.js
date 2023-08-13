// formats the given file size for display
export default function calculateSize(bytes) {
    if (bytes < 1024) {
        return `${bytes}B`;
    } else {
        const kilobytes = Math.floor(bytes / 1024);

        if (kilobytes < 1024) {
            return `${kilobytes}KB`;
        } else {
            const megabytes = Math.floor(kilobytes / 1024);

            if (megabytes < 1024) {
                return `${megabytes}MB`;
            } else {
                return `${Math.floor(megabytes / 1024)}GB`;
            }
        }
    }
}
