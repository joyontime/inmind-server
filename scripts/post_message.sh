export TEXT="text=OotIF88iDiM1Z4bi5e2J7CwLDdQ77bxnmC3Of5hrcUA="
export PLANT="plant=52e165a4c543b54c37f07e27"

curl \
-k -u joy4luck:boo \
--data-urlencode "$TEXT" \
--data-urlencode "$PLANT" \
-i https://localhost:3050/messages
