import json
import os
from PIL import Image
import sys
from urllib.error import HTTPError
import urllib.request

from consts import ASSETS_DIRPATH, IMAGE_FMT_URL, INFO_FILEPATH, INFO_URL

# Toggle this if we want to cleanup whatever we have and start afresh
DO_CLEANUP = False

if __name__ == "__main__":
    if DO_CLEANUP:
        # Remove everything in the assets directory
        for file_name in os.listdir(ASSETS_DIRPATH):
            os.remove(os.path.join(ASSETS_DIRPATH, file_name))

    stamps_data = None

    try:
        with urllib.request.urlopen(
            urllib.request.Request(
                INFO_URL,
                headers={"User-Agent": "Python3"},
            )
        ) as fr, open(INFO_FILEPATH, "w") as fw:
            stamps_data = json.load(fr)
            json.dump(stamps_data, fw)
    except HTTPError as e:
        sys.exit("error while fetching JSON data: {}".format(e))

    # For each of the stamps, convert, resize and then save them
    for stamp_info in stamps_data["items"]:
        stamp_slug = stamp_info["slug"]
        if stamp_slug == "":
            continue

        stamp_file_path = os.path.join(
            ASSETS_DIRPATH,
            "{}.webp".format(stamp_slug),
        )
        if os.path.exists(stamp_file_path):
            # If a file already exists, we don't need to download it again
            continue

        try:
            with urllib.request.urlopen(IMAGE_FMT_URL.format(stamp_slug)) as fr:
                img = Image.open(fr)
                img.resize(
                    (180, 180),
                ).save(stamp_file_path, format="webp")
        except HTTPError as e:
            sys.exit("error fetching image for '{}': {}".format(stamp_slug, e))
        except ConnectionRefusedError as e:
            sys.exit("error fetching image for '{}': {}".format(stamp_slug, e))
