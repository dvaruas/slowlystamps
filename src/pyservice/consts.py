import os

# All RAW assets are stored in this path
ASSETS_DIRPATH: str = os.path.join(
    os.path.dirname(__file__), os.pardir, os.pardir, "static", "assets"
)

# Information about all stamps is found API
INFO_URL: str = "https://api.getslowly.com/slowly"
# The raw JSON received from fetchInfoURL is saved in this location
INFO_FILEPATH: str = os.path.join(ASSETS_DIRPATH, "slowly.json")

# Individual images of stamps can be found here
IMAGE_FMT_URL: str = "https://cdn.getslowly.com/assets/images/stamp/{}.png"
