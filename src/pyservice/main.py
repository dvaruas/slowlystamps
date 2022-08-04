import json
import os
import sys
import urllib.request
from urllib.error import HTTPError
from urllib.parse import quote

from PIL import Image

from consts import ASSETS_DIRPATH, IMAGE_FMT_URL, INFO_FILEPATH, INFO_URL

# Toggle this if we want to cleanup whatever we have and start afresh
DO_CLEANUP = False

if __name__ == "__main__":
    if DO_CLEANUP:
        # Remove everything in the assets directory
        for file_name in os.listdir(ASSETS_DIRPATH):
            os.remove(os.path.join(ASSETS_DIRPATH, file_name))

    stamps_data = None
    did_anything_change = False

    try:
        with urllib.request.urlopen(
            urllib.request.Request(
                INFO_URL,
                headers={"User-Agent": "Python3"},
            )
        ) as fr:
            stamps_data = json.load(fr)
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

        # Atleast one new file has been detected. This signifies we have some
        # new information at hand
        did_anything_change = True

        try:
            with urllib.request.urlopen(IMAGE_FMT_URL.format(quote(stamp_slug))) as fr:
                img = Image.open(fr)
                img.resize(
                    (180, 180),
                    Image.LANCZOS,
                ).save(stamp_file_path, format="webp", quality=100)
        except HTTPError as e:
            sys.exit("error fetching image for '{}': {}".format(stamp_slug, e))
        except ConnectionRefusedError as e:
            sys.exit("error fetching image for '{}': {}".format(stamp_slug, e))

    if did_anything_change:
        with open(INFO_FILEPATH, "w") as fw:
            json.dump(stamps_data, fw)

    print(
        "Script completed successfuly. Changes detected status : {}".format(
            did_anything_change
        )
    )
