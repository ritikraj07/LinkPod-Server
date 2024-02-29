function extractIdFromLinkedInUrl(url) {
    // Regular expression pattern to match the ID in the URL
    const pattern = /-([\d]+)-/;

    // Match the pattern in the URL
    const match = url.match(pattern);

    // Check if there's a match and return the ID, or return null if no match found
    return match ? match[1] : null;
}

module.exports = extractIdFromLinkedInUrl;