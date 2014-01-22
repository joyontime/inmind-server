export ARCHIVED="archived=true"
export ID="id=52dfc081aa9317db32cb7764"
export STATE="state=3"

curl \
-k -u joy4luck:boo \
--data-urlencode "$ARCHIVED" \
--data-urlencode "$ID" \
--data-urlencode "$STATE" \
-i 'https://localhost:3050/plants/update'
