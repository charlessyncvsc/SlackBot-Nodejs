# Purpose

Doing a simple project to host a simple express api with a simple web front end.
```
        \  \  \   \  \                                               
       \\|    | ||   |                                               
      ||   /\     /\   |                                             
      ||  /  \   /  \ ||                                             
       |              |                                              
       |       O      |                                              
        \            /-----------+                                   
         -----------             |                                   
         +------                 |                                   
         |                       |                                   
         |              +--------v---------+                         
         |              |      SLACK       |                         
         |              |      CHAT        |                         
         |              +---------+--------+                         
         |                        |                                  
         |              +---------+--------+                         
         |              |      SLACK       |                         
         |              |      SERVER      |
         |              +---------^--------+                         
         |                        |                                  
         |                        |                                  
+--------v-------+      +---------v--------+              +------------------+           
|                |      |                  |              |                  |
|     /www (5173)|      |     /bot (3000)  |              |    DialogFlow    |   
|     reactjs    |      |     Nodejs       |<-----------> |                  |                              
|                |      |                  |              |    External      | 
|                |      |                  |              |    Service       |
+-------^--------+      +--------^---------+              +------------------+           
        |                        |                                   
        |                        |                                   
+-------v------------------------v---------+                         
|                                          |                         
|                /api  (4001)              |                         
|              ExpressAPI Nodejs           |                         
|                                          |                         
+------------------------------------------+                         
```                                        


## DialogFlow

Target DialogFlow architecture
![alt text](docs/images/image.png)

**Reason:** One can control what goes into DialogFlow, as oppose to it being user driven.

Dialogflow has capability to send the extracted parameters as webhook to external locations however given I am in the local environment, i'd rather handle the parameters in my code. All I need the dialogflow agent to do is to extract those important parameters.

## To try
Please use the devcontainer to spin up the relevant services. tasks.json will initialize the webclient, bot, and the api when the project loads. Assuming you have docker, devcontainer etc all done.

## Pre-requisites
- Slack account. Please sign up for the api services and make sure you follow the process to create the equivalent application and retrieve the necessary keys, signing tokens.
- Google dialogflow. You need a google account and access to google console and dialogflow to manage dialogflow fully. 
- You will also need to setup the agent in dialogflow to handle the exchangese between the bot and the users. The configuration can be imported directly by uploading `bot/Seb.zip` file into dialogflow.