const url = 'https://01.kood.tech/api/graphql-engine/v1/graphql';
const jwtToken = localStorage.getItem('jwtToken');
let dataForGraph = [];

export { dataForGraph };
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
      export async function showProgress() {
        const jwtToken = localStorage.getItem('jwtToken');
        const url = 'https://01.kood.tech/api/graphql-engine/v1/graphql';
      
        const query = `query {
          progress(where: {
            object: {
              type: {_nregex: "exercise|raid|exam|module|games|administration"}
            }
            grade: {_is_null: false}
          }, order_by: {updatedAt: asc}) {
            id
            objectId
            updatedAt
            grade
            object{
              type
              name
            }
          }
        }`;
      
        try {
          const response = await fetch(url, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${jwtToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query }),
          });
      
          if (!response.ok) {
            console.log('Error fetching progress data');
            return;
          }
      
          const data = await response.json();
          console.log("Progress data:", data)
      
          if (!data || !data.data || !data.data.progress || !Array.isArray(data.data.progress)) {
            console.log('Invalid or missing progress data in the response');
            return;
          }
          
           dataForGraph = await Promise.all(
            data.data.progress.map(async(project)=> {
              const taskData = {
                name: project.object.name,
                grade: project.grade,
                updatedAt: new Date(project.updatedAt),
              };
              const xp = await showXPSum(taskData.name);
              taskData.xp = xp;
              return taskData
            })
          );
          console.log("DataGraph in queires.js :",dataForGraph)
      
          const grade = data.data.progress.map((project) => project.grade);
          const sum = grade.reduce((acc, next) => acc + next, 0);
          const avg = (sum / grade.length).toFixed(2);
          console.log(data.data.progress);
      
          const projects = data.data.progress.map((project) => {
            return showXPSum(project.object.name);
          });
      
          const res = await Promise.all(projects);
          console.log("Res data", res);
          
          const totalXP = res.reduce((acc, xp) => acc + xp, 0);
          const totalXPElem = document.getElementById('totalXP');
          totalXPElem.textContent = `${Math.round(totalXP / 1000)}KB`;
          console.log(Math.round(totalXP / 1000));
        } catch (error) {
          console.error('Error:', error.message);
        }
      }
      
      export async function showXPSum(projectName) {
        const jwtToken = localStorage.getItem('jwtToken');
        const url = 'https://01.kood.tech/api/graphql-engine/v1/graphql';
      
        const query = `query {
          transaction(
            where: { 
              object: {name: {_eq : "${projectName}"}}}
              order_by: {amount: desc},
              limit: 1
          ) {
            object {
              name
              progresses (
                where : {
                  isDone: {_eq: true}
                }
              ){
                updatedAt
              }
            }
            amount
          }
        }`;
      
        try {
          const response = await fetch(url, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${jwtToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query }),
          });
      
          if (!response.ok) {
            console.log('Error fetching transaction data');
            return 0;
          }
      
          const data = await response.json();
      
          if (data.data.transaction[0]) {
            return data.data.transaction[0].amount;
          } else {
            return 0;
          }
        } catch (error) {
          console.error('Error:', error.message);
          return 0;
        }
      }
      