import os
import random
import string
import concurrent.futures

def generate_random_text(size_in_bytes):
    # Generate random characters that form a string of the given size in bytes
    return ''.join(random.choices(string.ascii_letters + string.digits + string.punctuation, k=size_in_bytes))

def create_single_dir_and_file(ein_number, base_dir, file_size):
    dir_name = f'ein-{ein_number}'
    dir_path = os.path.join(base_dir, dir_name)

    # Create the directory
    os.makedirs(dir_path, exist_ok=True)

    # Create index.html file with random content of the specified size
    file_path = os.path.join(dir_path, 'index.html')
    with open(file_path, 'w') as f:
        random_text = generate_random_text(file_size)
        f.write(random_text)

def create_files_and_dirs_parallel(dir_count, file_size):
    # Create the output directory structure
    base_dir = './output/nonprofit'
    if not os.path.exists(base_dir):
        os.makedirs(base_dir)

    # Use ThreadPoolExecutor for parallel directory and file creation
    with concurrent.futures.ThreadPoolExecutor() as executor:
        # Prepare a list of EIN numbers
        futures = []
        for _ in range(dir_count):
            ein_number = str(random.randint(10000000, 99999999))
            # Submit a task for each directory/file creation
            futures.append(executor.submit(create_single_dir_and_file, ein_number, base_dir, file_size))

        # Wait for all threads to complete
        for future in concurrent.futures.as_completed(futures):
            future.result()  # This will raise any exceptions that occurred during execution

    print(f"{dir_count} directories with {file_size} bytes files have been created in '{base_dir}'.")

# Example usage
dir_count = 900_000  # Number of directories to create
file_size = 3 * 1024  # File size in bytes (700KB)

create_files_and_dirs_parallel(dir_count, file_size)
