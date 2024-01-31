export  const graphqlQuery = `{
    user {
        #Information de l'utilisateur
        id
        login
        firstName
        lastName
        email
        #Pour les audits
        auditList: audits (where :{grade : {_is_null : false}}, limit: 14) {
            grade
            group {
                captainLogin
                object {
                    name
                }
            }
        }
    }
    #Pour les XP
    xp : transaction_aggregate(
        where: {type: {_eq: "xp"}, event: {object: {type: {_eq: "module"}}}}
      ) {
        aggregate{
            sum{
                amount
            }
        }
    }
    #Pour les skills
    skills : transaction(
        where:{_or: {type: {_like: "skill_%"}}}
        distinct_on:[type]
        order_by:[{type: asc}, {amount: desc}]){
            amount
            type
    },
    #Les 4 derniers projets
    last_activity : transaction(where: {type:{ _eq: "xp" }, 
      	path: {_nlike: "%piscine%" }} order_by:{createdAt: desc}, limit: 4){
		object{
            name
        }
        amount
    	createdAt
	}
    #Progrssion
    xpProgression: transaction(where: {_and:[{type: {_eq: "xp"}, event:{object:{type :{_eq: "module"}}}}]}, order_by:{createdAt: asc})
	{
        type
        amount
        object{
            name
        }
    	createdAt
	}
    #Nombre de tentative par exercice
    attemps: transaction(where:{_and: [{type: {_eq: "xp"}, object:{type: {_eq: "exercise"}}}]})
  	{
        object{
            name
            progresses_aggregate{
                aggregate{
                    count(columns: grade)
                }
            }
        }
    } 
}`;