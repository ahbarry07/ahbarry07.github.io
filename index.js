import { homePage} from "./home.js"
import { loginPage, fetchGraphQLData } from "./login.js"
import { graphqlQuery } from "./query.js"

loginPage()

window.onload = function(){

    let jwtToken = localStorage.getItem("jwtToken")

    if (jwtToken){
        let result = fetchGraphQLData(jwtToken, graphqlQuery)
        result.then(dataQuery =>{
            homePage(dataQuery)
        })
    }else{
        loginPage()
    }
}