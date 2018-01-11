PRID_1718_G07 : Touré Tidiane & Hugo Barbachano 

#NOTES DE LIVRAISON :

We inplemented all the functionalities mentionned for PRID - Project 2017-2018.

##Descriptions des fonctionnalités

###Rôle admin & Rôle membre ::

-  Gérer les inscriptions des membres aux tournois: 
    + We have two buttons for inscriptions of members to the tournament :
        * Save => save the list of assigned members but keep the tournament subscriptions open
        * Close subscriptions => close the subscriptions in the tournament and displays the results for each game.
            The admin and the member cannot manage inscriptions/subscribe to a Tournament when it is closed.
    + The buttons to send assigned/unassigned members automatically disappear if the limit to maximum players is reached.

-   Visualiser le résultat des tournois:
    + When a game is created, the scores are set by default at "-1" to indicate that the player hasn't updated 
        his score yet.
    + If both players have updated their scores, the match is closed

- Validations of games : 
    + Scores can't get a string value

- Validations of tournaments : 
    + the name of a tournament is unique
    + finish date cannnot be inferior to start date

- Validations of members :
    + a Confirm Password field is set when editing/adding a member


##Fonctionnalités Manquantes
No missing functionalities (to our knowledge) !

##Bugs connus