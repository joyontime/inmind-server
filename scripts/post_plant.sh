export GROUP="group_id=1"
export SHARED_WITH="shared_with=['joy4luck', 'foo']"
export TITLE="title=daisy"
export SALT="salt=NaCl"
export PASS="passphrase=open"

curl \
--data-urlencode "$GROUP" \
--data-urlencode "$SHARED_WITH" \
--data-urlencode "$TITLE" \
--data-urlencode "$SALT" \
--data-urlencode "$PASS" \
-i http://localhost:3000/plant
