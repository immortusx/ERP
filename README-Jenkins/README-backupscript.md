<h2>🛠️ How it works:</h2>

This Jenkins job uses Shell script to:

<p>i) use mysql dump command to backup the database for the given paramter of the database. And it compresses to .gz file extenstion </p>
<p>ii) a backup path is used PATH:/backup/jenkins/script to store the backup data </p>
<p>iii) then by shell script it also copies the data of the website under /logo folder </p>
<p>iv) then the whole folder which includes the sql dump and logos folder is compressed into a zip file along with today's date and time along with the website name provided </p>
<p>v) then this zip file is copied into a particular folder. And is organised properly </p>
