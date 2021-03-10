# Team Trivia

This is little helper app to facilitate trivia games held over video call with multiple participants where answers are made verbally. During a call there are various delays which are different for different people so it can be difficult to determine who answers a question first. This was originally written in quickly in jquery and I rewrote it in React to refamiliarise myself with React.

There are two interface parts, one for the players and one for the host, and currently uses firebase to store sessions (although this could be any database/api that can return json). The player interface has been converted to React, the host interface currently remains in jquery.

In the player interface, the user must first enter their name, and a cookie is stored to establish that they are a player so they will not see that part of the interface again. Then they will enter the player listings where they can hit the answer button to register an answer for a particular question.

In the host interface, the host can see which players have answered for a particular question, and in what order. They can also increment the question which clears the answers.

## Database structure

sessions
|
|____current session
    |
    |____question: integer
    |
    |____users
         |
         |____usertoken
             |
             |____user
                  |
                  |____name: string
                  |____score: integer
         
