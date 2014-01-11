export SHARED_WITH='shared_with=["joy4luck"]'
export TITLE="title=iris"
export SALT="salt=NaCl"
export PASS="passphrase=open"

curl \
-k -u joy4luck:boo \
--data-urlencode "$SHARED_WITH" \
--data-urlencode "$TITLE" \
--data-urlencode "$SALT" \
--data-urlencode "$PASS" \
-i https://localhost:3050/plants
