#!/bin/bash

# Specify the path to your build.gradle file
file_path="Vehicle_app/android/app/build.gradle"
ENV_DATABASE=$(env | grep '^ENV_DATABASE=' | cut -d= -f2)
BUILD_ID=$(env | grep '^BUILD_ID=' | cut -d= -f2)
# Use grep to extract the versionName value
version_name=$(grep -oP 'versionName "\K[^"]+' "$file_path")

# Print the versionName value
echo "$version_name"

BUILD_ID=$BUILD_ID
ENV_DATABASE=$ENV_DATABASE

echo "${ENV_DATABASE}"
sudo mysql ${ENV_DATABASE} -e "UPDATE versions SET versionName = '$version_name' WHERE id = 1;"
