export GROUP="group_id=1"
export SHARED_WITH="shared_with=['joy4luck', 'foo']"
export TITLE="title=gardenia"
export SALT="salt=NaCl"
export PASS="passphrase=open"

curl \
-k -u joy4luck:boo \
--data-urlencode "$GROUP" \
--data-urlencode "$SHARED_WITH" \
--data-urlencode "$TITLE" \
--data-urlencode "$SALT" \
--data-urlencode "$PASS" \
-i https://localhost:3050/plants
