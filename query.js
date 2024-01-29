export  const graphqlQuery = `{
    #Information de l'utilisateur
    user {
        id
        login
        firstName
        lastName
        email
    },
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
    skills :transaction(
        where:{_or: {type: {_like: "skill_%"}}}
        distinct_on:[type]
        order_by:[{type: desc}, {amount: desc}]){
            amount
            type
    },
    #Pour les audits
    audit (where :{ _and :[ { auditorId : {_eq : 7714}} , {grade : {_is_null : false}} ]}, limit : 14) {
        grade
        group {
            captainLogin
            object {
                name
            }
        }
    }
    #Les 4 derniers projets
    last_activity: transaction(where: {type:{ _eq: "xp" }, 
      	path: {_nlike: "%piscine%" }} order_by:{createdAt: desc}, limit: 4){
		object{
            name
        }
        amount
    	createdAt
	}
}`;