proj2
=====

Twitter Clone: 

App link: 

http://fritter-zhar.rhcloud.com/

App description: 

My app lets users log in to their accounts, post new freets, view freets posted by all users, and edit/delete the only the freets that they posted. 

Design Challenges:

There were some problems I ran into with implementation of the edit/delete function. To connect to an edit/delete page to change a specific post, I needed a way to identify the post to access it in the database. I explored two options, one to use a href link and two to use a form. Originally, for each post the user wrote I included a href link that included the _id of the post. I used the _id because it is unique to each post. Then, when the user clicks the link, the app opens an edit page that uses the _id from the link to find the post in the database to make changes. However, one bad part of this implementation was that the _id was now visible on the link, publically exposing the database field. I alleviated this problem by wrapping the displayed post in a form along with a edit/delete button. Inside the form, I was able to store the post _id in a hidden input tag so I could transfer it to the edit page. (https://github.com/6170-fa14/rujiazha_proj2/blob/master/views/users/index.ejs#L27). 

Another problem is to know which user is making changes to posts or creating new posts. I considered taking the username from the html page. However, this is not a secure practice because html elements can be changed externally. Therefore, I created a user field in the current session when a user logs in. (https://github.com/6170-fa14/rujiazha_proj2/blob/master/routes/index.js#L29) I can access this user field to know which user is making changes. Additionally, having this field also allows me to easily distinguish between posts made by the user and posts made by others, which I need to know which posts to allow for edits. (https://github.com/6170-fa14/rujiazha_proj2/blob/master/routes/users.js#L17). 

In order to ensure that only users with accounts can use the app, I included a function, checklogin, that checked if a user is logged in. If no user is logged in, then nothing is accessible but the homepage and the make new account page. I add a user field to the current session when a user logs in, so I check if the a user is logged in by checking in req.session if the user field is present. If someone is trying to access an internal page without first logging in, the app redirects them to the home page instead of throwing an error, making the app easier to use. I originally wrote out the function for all get methods, but for modularity I set the function externally and referred to it from every method instead. (https://github.com/6170-fa14/rujiazha_proj2/blob/master/routes/users.js#L5)

Also, I noticed that a user remains logged in after closing and reopening the app on the same browser. In order to ensure account security, and allow the user the choice continue to be logged in after closing the app, I added the log out function. I implemented logout by calling req.session.destroy so that the app will revert to the path it takes when no user has been specified as a field. (https://github.com/6170-fa14/rujiazha_proj2/blob/master/routes/users.js#L22)

In the app, I wanted to avoid redundancies in usernames, and I wanted passwords to be secure. Therefore, in the signup page I made sure that a user could not take a username already in the database and that the password had to be 8 characters. Additionally, I checked for accidental blank submissions by not allowing the username field to be blank. (https://github.com/6170-fa14/rujiazha_proj2/blob/master/routes/index.js#L24)

PROJECT 2, PART 2

Grading Directions: 

My additional feature allows users to favorite posts they can see and see how many favorites each post has. 

Additionally, I allow a user's tweet to submit only if there is something written. This way, there will not be unintentional blank posts. 

Data Model:

Attached in the pdf version of this document 

Design Challenges:



