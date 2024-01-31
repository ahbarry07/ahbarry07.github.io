import { homePage} from "./js/home.js"
import { loginPage, fetchGraphQLData } from "./js/login.js"
import { graphqlQuery } from "./js/query.js"

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