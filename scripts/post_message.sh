export TEXT="text=chipmunk"
export PLANT="plant=123"

curl \
-k -u joy4luck:boo \
--data-urlencode "$TEXT" \
--data-urlencode "$PLANT" \
-i https://localhost:3050/messages
