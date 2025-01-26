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
         |              +---------+--------+                         
         |                        |                                  
         |                        |                                  
+--------v-------+      +---------+--------+              +------------------+           
|                |      |                  |              |                  |
|     /www       |      |     /bot         |              |    DialogFlow    |   
|     reactjs    |      |     Nodejs       |<-----------> |                  |                              
|                |      |                  |              |    External      | 
|                |      |                  |              |    Service       |
+-------+--------+      +--------+---------+              +------------------+           
        |                        |                                   
        |                        |                                   
+-------+------------------------+---------+                         
|                                          |                         
|                /api                      |                         
|              ExpressAPI Nodejs           |                         
|                                          |                         
+------------------------------------------+                         
```                                        


## DialogFlow

Target DialogFlow architecture
![alt text](docs/images/image.png)

Reason: One can control what goes into DialogFlow, as oppose to user driven.