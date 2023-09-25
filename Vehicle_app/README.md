### Refer This Official Site For Latest Update To Setup : https://reactnative.dev/docs/

# Setting up the development environment For React Native in Windows (Android OS)

-- Step 1 : Install The LTS(Long Term Support) version of NodeJS and NPM package Manager.

## Setting Up The React Native CLI

-- Step 2 : Install Chocolatey CLI: - Install with PowerShell.exe >>> Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

        - Install with cmd.exe
            >>> @"%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe" -NoProfile -InputFormat None -ExecutionPolicy Bypass -Command "[System.Net.ServicePointManager]::SecurityProtocol = 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))" && SET "PATH=%PATH%;%ALLUSERSPROFILE%\chocolatey\bin"

        -Check Choco Installed Correctly : > choco --version

-- Step 3 : Install Depedencies... (Node , JDK).

        - Install the  Java SE Development Kit (JDK):
        - choco install -y openjdk11

-- Step 4 : Install Android Studio (Android Development Environment). - On Android Studio installation wizard, make sure the boxes next to all of the following items are checked:
 -Android SDK
 -Android SDK Platform
 -Android Virtual Device

-- Step 5 : Install the Android SDK (requires Android Version 13 tiramisu) - Check the Site for Latest Version - On Studio Welcome - click on More Settings > SDK Manager > SDK Platforms then check the box next to "Show Packeage Details in the bottom right corner. Look for and expand the Android 13 (Tiramisu),then make sure the following items are checked

Android SDK Platform 33
Intel x86 Atom_64 System Image or Google APIs Intel x86 Atom System Image

 click Next select "SDk Tools" check the box next to "Show Package Details" .Look for and expand the Android SDK Build-Tools, make sure that 33.0.0 is selected.

-- Step 6 :Configure the ANDROID_HOME environment variable (React Native tools require some environment variables to be set up in order to build apps with native code.)
you can find the actual location of SDK in the Android Studio setting > Appearance & Behavior > System Settings > Android SDK.

--Step 7 : Add platform-tools to Path(set Environment Variables ANDROID_HOME and JAVA_HOME ):Windows Control Panel > User Accounts > User Accounts > Change my environment variables > Select the Path variable > Click Edit >Click New and add the path to platform-tools to the list.

 ## Creating a new application
 If you previously installed a global react-native-cli package, please remove it as it may cause unexpected issues:

  create your React native Project using Command
  npx react-native@latest init AwesomeProject

  ## Running your React Native application
  Step 1: Start Metro
    npm start

  Step 2: Start your application
     npm run android
