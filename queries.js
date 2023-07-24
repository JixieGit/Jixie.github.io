const url = 'https://01.kood.tech/api/graphql-engine/v1/graphql';


export function showLevel() {
    console.log('showLevel showing level')
    const jwtToken = localStorage.getItem('jwtToken');

    const query = `
    {
        transaction(
          where:  {type: {_eq: "level"}, object: {type: {_nregex: "exercise|raid"}}}
          limit: 1
          offset: 0
          order_by: {amount: desc}
        ) {
          amount
        }
      
      } `
      const options = {
        method: "POST",
        headers: {
            'Authorization': `Bearer ${ jwtToken }`,
            'Content-Type':'application/json'
        },
        body: JSON.stringify({ query }),
      };

      console.log('Making GraphQL request with options:', options)
      fetch(url, options)
      .then(response => {
        if(!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data=> {
        const amount = data?.data?.transaction[0]?.amount;

        if (amount !== undefined){
            const levelElement = document.getElementById('level');
            levelElement.textContent = `${amount}`;
        } else {
            console.log('No level data found in the response');
        }
        })
        .catch(error => {
            console.error('Error fetching level data', error);
        });
      }
      



