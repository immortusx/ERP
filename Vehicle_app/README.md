
### Refer This Official Site For Latest Update To Setup : https://reactnative.dev/docs/ 

# Setting up the development environment For React Native in Windows (Android OS)

-- Step 1 : Install The LTS(Long Term Support) version of NodeJS and NPM package Manager.

## Setting Up The React Native CLI

-- Step 2 : Install Chocolatey CLI:
        - Install with PowerShell.exe
            >>> Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

        - Install with cmd.exe
            >>> @"%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe" -NoProfile -InputFormat None -ExecutionPolicy Bypass -Command "[System.Net.ServicePointManager]::SecurityProtocol = 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))" && SET "PATH=%PATH%;%ALLUSERSPROFILE%\chocolatey\bin"

        -Check Choco Installed Correctly : > choco --version

-- Step 3 : Install Depedencies... (Node , JDK).

        - Install the  Java SE Development Kit (JDK):
        - choco install -y openjdk11

-- Step 4 :  Install Android Studio (Android Development Environment).
        - On Android Studio installation wizard, make sure the boxes next to all of the following items are checked:
            Android SDK
            Android SDK Platform
            Android Virtual Device
        
-- Step 5 :  Install the Android SDK (requires Android Version 13 tiramisu) - Check the Site for Latest Version
        - On Studio Welcome - click on More Settings > SDK Manager

-- Step 6 : 
