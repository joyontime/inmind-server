export COLOR="color=2"
export PASS="passphrase=open"
export SALT="salt=NaCl"
export SHARED_WITH='shared_with=["joy4luck"]'
export TITLE="title=iris"

curl \
-k -u joy4luck:boo \
--data-urlencode "$COLOR" \
--data-urlencode "$SHARED_WITH" \
--data-urlencode "$TITLE" \
--data-urlencode "$SALT" \
--data-urlencode "$PASS" \
-i https://localhost:3050/plants
