mongoexport --host localhost:27017 --db inm-db --collection plants \
-f _id,archived,color,created_at,group_id,modified_at,owner,passphrase,salt,shared_with,state,title,type \
--csv > ./csv/plants.csv

mongoexport --host localhost:27017 --db inm-db --collection \
users -f _id,created_at,group_id,group_id --csv > ./csv/users.csv

mongoexport --host localhost:27017 --db inm-db --collection \
groups -f _id,created_at,group_id,members --csv > ./csv/groups.csv

mongoexport --host localhost:27017 --db inm-db --collection \
messages -f _id,user_id,plant,created_at --csv > ./csv/messages.csv

echo "Download attachments!" | mutt \
-a "./csv/plants.csv" \
-a "./csv/users.csv" \
-a "./csv/groups.csv" \
-a "./csv/messages.csv" \
-s "InMind Data" -- drgnfnix@gmail.com

