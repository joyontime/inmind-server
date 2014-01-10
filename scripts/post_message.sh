export USER="user_id=joy4luck"
export TEXT="text=bunnies"
export PLANT="plant=123"

curl \
--data-urlencode "$USER" \
--data-urlencode "$TEXT" \
--data-urlencode "$PLANT" \
-i https://localhost:3050/messages
