# Word Frequency Analyzer

This project is a Python script that fetches the content of a web page, processes the text, and analyzes word frequencies. It retrieves the most frequent words within a specified rank range and displays them.

## Features

- Fetches text content from a given URL.
- Processes the text by removing punctuation and converting it to lowercase.
- Counts word frequencies using `collections.Counter`.
- Retrieves words within a specified rank range based on frequency.

## Requirements

- Python 3.6 or higher
- Internet connection (to fetch the web page content)

## Installation

1. Clone this repository or download the script.
    ```bash
    git clone https://github.com/jerwkw/AISG-TA.git
    cd aisg-TA/part_1
    ```
2. Ensure you have Python installed on your system.

## Usage

1. Open the script file `part1.py`.
2. Modify the `url`, `start_rank`, and `end_rank` variables in the `main()` function if needed:
   - `url`: The URL of the text file to analyze (default is a Project Gutenberg text).
   - `start_rank`: The starting rank of words to display (default is 10).
   - `end_rank`: The ending rank of words to display (default is 20).
3. Run the script:
   ```bash
   python part1.py