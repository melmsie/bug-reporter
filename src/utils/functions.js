const validImageTypes = ['png', 'gif', 'jpeg', 'jpg', 'webp'];
module.exports = class MiscFunctions {
  /**
   * @param {String} url The "image" url to validate the suffix
   * @param {String} contentType The content type field from a resolved image
   * @returns {Boolean} True if it's a valid image, false otherwise
   */
  validateImage (url, contentType = 'image') {
    if (!url) return false;
    const [suffix] = url.split('.').slice(-1);
    if (validImageTypes.includes(suffix) && contentType.includes('image')) {
      return true;
    }
  }

  /**
   * Creates an array of strings from a given string, each string being at most 2000 characters/the given limit
   * @param {String} text The text to create an array of "pages" from
   * @param {Number} [limit=2000] The limit of characters for a page, defaults to `2000`
   * @returns {Array<String>} The given text, paginated into an array according to the specified limit
   */
  paginate (text, limit = 4096) {
    const lines = text;
    const pages = [];

    let chunk = '';

    for (const line of lines) {
      if (chunk.length + line.length > limit && chunk.length > 0) {
        pages.push(chunk);
        chunk = '';
      }

      if (line.length > limit) {
        const lineChunks = line.length / limit;

        for (let i = 0; i < lineChunks; i++) {
          const start = i * limit;
          const end = start + limit;
          pages.push(line.slice(start, end));
        }
      } else {
        chunk += `${line}\n`;
      }
    }

    if (chunk.length > 0) {
      pages.push(chunk);
    }

    return pages;
  }

  editDistance (s1, s2) {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();

    const costs = [];
    for (let i = 0; i <= s1.length; i++) {
      let lastValue = i;
      for (let j = 0; j <= s2.length; j++) {
        if (i === 0) {
          costs[j] = j;
        } else {
          if (j > 0) {
            let newValue = costs[j - 1];
            if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
              newValue =
                Math.min(Math.min(newValue, lastValue), costs[j]) +
                1;
            }
            costs[j - 1] = lastValue;
            lastValue = newValue;
          }
        }
      }
      if (i > 0) {
        costs[s2.length] = lastValue;
      }
    }
    return costs[s2.length];
  }

  similarityBetween (s1, s2) {
    let longer = s1;
    let shorter = s2;
    if (s1.length < s2.length) {
      longer = s2;
      shorter = s1;
    }
    const longerLength = longer.length;
    if (longerLength === 0) {
      return 1.0;
    }
    return (
      (longerLength - this.editDistance(longer, shorter)) /
      parseFloat(longerLength)
    );
  }

  search (input, all) {
    const inputWords = input.split(' ');
    const output = {};

    for (const bug of all) {
      const bugWords = bug.split(' ');
      let totalSimilarity = 0;

      for (const bugWord of bugWords) {
        for (const inputWord of inputWords) {
          if (bugWord === inputWord) {
            totalSimilarity += 2; // bonus points for same word, tweak if needed
          }
          totalSimilarity += this.similarityBetween(bugWord, inputWord);
        }
      }

      output[bug] = totalSimilarity / (inputWords.length + bugWords.length);
    }

    return output;
  }
};
