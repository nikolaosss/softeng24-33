# SoftEng24-33 - Connect.oll

Before setting up the project, ensure you have the following installed:

MySQL (for database management)
Node.js (for running the backend)
Java (if any Java-based dependencies are required)
Python (for CLI scripts and additional utilities)
Postman (optional, for API testing)
React (for the frontend)

--Clone the repository: 
      -git clone https://github.com/ntua/softeng24-33.git
      -cd softend24-33
--Install dependencies:
      -npm install
--To run https:
      -Download mkcertfrom GitHub: https://github.com/FiloSottile/mkcert/releases
      -Unzip and place mkcert.exe inside to C:\Windows\System32
      -From Windows Powershell(as administrator) run -- mkcert -install and then --mkcert localhost
      -Place the two newly created files, in the directory you are running the back-end server
--Create database:
      -node createdatabase.js(with your username and password)
--Start the local server:
      -node app.js(back-end server) Server will be running at https://localhost:3001/api/
      -npm start(front-end server) Server will be running at http://localhost:9600/api/
