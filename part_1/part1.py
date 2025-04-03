import urllib.request
import string
import collections

def get_web_text(url):
    """
    Fetches the content of a web page.

    Args:
        url (str): The URL of the web page to fetch.

    Returns:
        str: The content of the web page.
    """
    try:
        with urllib.request.urlopen(url) as response:
            if response.status == 200:
                return response.read().decode('utf-8')
            else:
                print(f"Error: Received status code {response.status}")
                return None
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return None
    
def process_text(text):
    """
    Processes the text content to extract lines with more than 50 characters.

    This function performs the following steps:
    1. Removes all punctuation from the text
    2. Translate all punctuation into whitespace
    3. Splits the text into words based on whitespace

    Args:
        text (str): The text content to process.

    Returns:
        list: A list of lines with more than 50 characters.
    """
    text = text.lower()
    punctuation = string.punctuation + '”“’‘—_'
    translator = str.maketrans(punctuation, ' '*  len(punctuation))
    text = text.translate(translator)

    # Split the text into words based on whitespace
    # This removes extra whitespace caused by punctuation removal
    words = text.split()

    words = [word for word in words if word]
    return words

def count_word_frequencies_with_counter(words):
    """
    Counts the frequency of each word using collections.Counter

    Args:
        words (list): A list of words

    Returns:
        collections.Counter: A Counter object mapping words to frequencies
                             Returns an empty Counter if the input list is empty
    """
    if not words:
        return collections.Counter()

    word_counts = collections.Counter(words)
    return word_counts

def get_top_words_from_counter(word_counts, start_rank=10, end_rank=20):
    """
    Gets words within a specific rank range from a Counter object.

    Args:
        word_counts (collections.Counter): The Counter object with word frequencies.
        start_rank (int): The starting rank
        end_rank (int): The ending rank.

    Returns:
        list: A list of (word, count) tuples for the specified rank range,
              or None if ranks are invalid or not enough words exist.
    """
    if not word_counts or start_rank < 1 or end_rank < start_rank:
        return None

    most_common_words = word_counts.most_common(end_rank) # Get top end_rank

    # Check if there are enough unique words
    if len(most_common_words) < start_rank:
         print(f"Only {len(most_common_words)} unique words found.")
         print(f"Cannot display words from rank {start_rank} to {end_rank}.")
         return None 

    start_index = start_rank - 1
    required_slice = most_common_words[start_index:end_rank]
    
    # Handle edge case where fewer than end_rank words exist, but more than start_rank
    if len(most_common_words) < end_rank:
        print(f"Only {len(most_common_words)} words found")
        required_slice = most_common_words[start_index:] # Get all from start_index onwards

    return required_slice

def main():
    url = "https://www.gutenberg.org/cache/epub/16317/pg16317.txt"
    start_rank = 10
    end_rank = 20

    content = get_web_text(url)
    if not content:
        print("Failed to retrieve content.")
        return
    
    words = process_text(content)
    if not words:
        print("No words found after processing the text.")
        return
    
    word_counts = count_word_frequencies_with_counter(words)
    if not word_counts:
        print("No word frequencies found.")
        return
    
    word_frequencies = get_top_words_from_counter(word_counts, start_rank, end_rank)
    if not word_frequencies:
        print("No word frequencies found in the specified rank range.")
        return
    
    print("Words ranked from 10th to 20th by frequency:")
    for word, count in word_frequencies:
        print(f"{word}: {count}")


if __name__ == "__main__":
    main()