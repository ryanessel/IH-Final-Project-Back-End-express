//MIDDLEWARE

const { expressjwt: jwt } = require("express-jwt");

//instantiate the JWT token validation middleare 
//(make an isntant of that JWT middleware)
const isAuthenticated = jwt({
    secret: process.env.TOKEN_SECRET,
    algorithms: ["HS256"],
    requestProperty: 'payload', 
    getToken: getTokenFromHeaders
  });

//function used to extract JWT token from the request's "Authorization" headers
function getTokenFromHeaders (req) {
    console.log("FUnction Running")
    //Check if token is available on the request Headers
    if (req.headers.authorization && req.headers.authorization.split(" ")[0] === "Bearer"
    ) { 
        console.log("HELLO")

        //Get encoded token string and return it
        const token = req.headers.authorization.split(" ")[1];
        return token;

    }

return null
}


//exporting our middleware so we can use it to create protected routes/protect routes

module.exports = {
    isAuthenticated
}




