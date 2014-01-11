export STATE="state=1"
export ID="id=52cf0c44982c11e3e91e3c18"

curl \
-k -u joy4luck:boo \
--data-urlencode "$STATE" \
--data-urlencode "$ID" \
-i 'https://localhost:3050/plants/update'
