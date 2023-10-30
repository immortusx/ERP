#!/bin/bash

# Check if a new app name is provided as an argument.
if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <new_app_name>"
    exit 1
fi

# New app name is the first argument provided.
NEW_APP_NAME="$1"

# Edit strings.xml
sed -i "s#<string name=\"app_name\">.*</string>#<string name=\"app_name\">$NEW_APP_NAME</string>#" android/app/src/main/res/values/strings.xml

# Replace white spaces and hyphens with underscores in NEW_APP_NAME
NEW_APP_NAME=$(echo "$NEW_APP_NAME" | sed -e 's/ /_/g' -e 's/-/_/g')

# Edit MainActivity.java
sed -i "16s/.*/    return \"$NEW_APP_NAME\";/" android/app/src/main/java/com/vehicle_crm/MainActivity.java

# Edit settings.gradle
sed -i "1s/.*/rootProject.name = '$NEW_APP_NAME'/" android/settings.gradle


# Edit app.json
{ echo "{"; echo "  \"name\": \"$NEW_APP_NAME\","; echo "  \"displayName\": \"$NEW_APP_NAME\""; echo "}"; } > app.json
