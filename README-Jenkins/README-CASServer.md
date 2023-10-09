<h2>🛠 What it does ?:</h2>

<p> This jenkins job is meant to build a .jar file. Which later is used to use as a server for mahavir-couirer-api-service </p>


<h2>🛠 How it works ?</h2>

<p>i) This job is also based on shell script. It has one parameter used to specify the name of the branch to build the .jar file from.</p>

<p>ii) Here, we clone the repository and build the jar file using </p>

  ```./gradlew build```

  This will build our jar file in dir /build/libs/.
  
<p>iii) The "scp" command will copy our file from one vm to another vm passworlessly. NOTE: We are able to connect to other server w/o password because we are using a key pairs generated on the 2nd server. Using that private key to connect via jenkins server allows to access without password.</p>

<p>iv) Once we have our file transfered. We will run a bunch of commands listed in cmd.txt (File in CASServer folder)</p>

```
cd ${WORKSPACE} && ssh root@95.217.134.153 < cmd.txt
```
