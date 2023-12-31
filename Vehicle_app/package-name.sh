#!/bin/bash

# Check if a new package name is provided as an argument.
if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <new_package_name>"
    exit 1
fi

# New package name is the first argument provided.
NEW_PACKAGE_NAME="$1"

# Replace white spaces and hyphens with underscores in NEW_PACKAGE_NAME
NEW_PACKAGE_NAME=$(echo "$NEW_PACKAGE_NAME" | sed -e 's/ /_/g' -e 's/-/_/g')

# Update the applicationId in build.gradle
sed -i "s/applicationId \"com.vehicle_crm\"/applicationId \"$NEW_PACKAGE_NAME\"/" android/app/build.gradle

# Update the namespace name in app/build.gradle
sed -i "s/namespace \"com.vehicle_crm\"/namespace \"$NEW_PACKAGE_NAME\"/" android/app/build.gradle

# Update the package name in MainApplication.java
sed -i "s/package com.vehicle_crm;/package $NEW_PACKAGE_NAME;/" android/app/src/main/java/com/vehicle_crm/MainApplication.java

# Update the package name in ReactNativeFlipper.java
sed -i "s/package com.vehicle_crm;/package $NEW_PACKAGE_NAME;/" android/app/src/release/java/com/vehicle_crm/ReactNativeFlipper.java

# Update the package name in MainActivity.java
sed -i "s/package com.vehicle_crm;/package $NEW_PACKAGE_NAME;/" android/app/src/main/java/com/vehicle_crm/MainActivity.java