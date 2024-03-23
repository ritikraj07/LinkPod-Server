function extractIdFromLinkedInUrl(url) {
    // Regular expression pattern to match the ID in the URL
    let pattern = /-([\d]+)-/;

    // Match the pattern in the URL
    let match = url.match(pattern);
    if (match && match[1]?.length != 19) {
        pattern = /activity-(\d+)-/;

        // Match the pattern in the URL
        match = url.match(pattern);
    }

    if (match == null || match[1]?.length != 19) {
        pattern = /activity:(\d+)/;

        // Match the pattern in the URL
        match = url.match(pattern);
    }

    if (match == null || match[1]?.length != 19) {
        let id = '';

        for (let i = 0; i < url.length; i++) {
            // Check if the character is a digit and append it to id
            if (!isNaN(parseInt(url[i], 10))) {
                id += url[i];
            } else if (id.length != 19) {
                id = ''; // Reset id if the character is not a digit and id length is not 19
            }
        }

        match = [null, id]; // Assign id to match to maintain consistency with previous matches
    }

    // Check if there's a match and return the ID, or return null if no match found
    return match ? match[1] : null;
}
