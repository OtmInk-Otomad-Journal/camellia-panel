import os
import requests
import subprocess

repo = "OtmInk-Otomad-Journal/camellia-panel"
name = "dist.tar.gz"

data = requests.get(f"https://api.github.com/repos/{repo}/releases/latest").json()

for item in data["assets"]:
    if os.path.exists(name):
        os.remove(name)
    if item["name"] == name:
        subprocess.run(["wget", item["browser_download_url"]])
        subprocess.run(["tar", "-xzvf", name])
