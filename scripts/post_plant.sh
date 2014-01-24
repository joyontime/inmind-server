export COLOR="color=2"
export PASS="passphrase=cb6f5cff7f64c65edf072c0cca1b9f28"
export SALT="salt=e068c517eed0ee3f5fa8a1208bceae595073937f8cdc4f5d2ec7f3e190e9f406"
export SHARED_WITH='shared_with=["52d016591750b5445bcea6a6"]'
export TITLE="title=iris"

curl \
-k -u joy4luck:boo \
--data-urlencode "$COLOR" \
--data-urlencode "$SHARED_WITH" \
--data-urlencode "$TITLE" \
--data-urlencode "$SALT" \
--data-urlencode "$PASS" \
-i https://sodiio.media.mit.edu:3050/plants
