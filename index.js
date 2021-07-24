const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const { WebClient } = require('@slack/web-api');
const web = new WebClient("xoxb-2328483976896-2305634417269-MGI49Et5A8XIo08tPfENRoWB");

const app = express();

app.use(express.json());


app.post("/slack/command", bodyParser.urlencoded({ extended: false }), (req, res) => {
  res.send();

  
  let arr = req.body.text;
  const channelID = req.body.channel_id;
  
  if(req.body.text){

  const arr2 = arr.split(",");
  
  const host = arr2[0]&&arr2[0].split("host:")[1]
  
  const emails = arr2[1]&&arr2[1].split("email:")[1]
 
  const jiraApiToken = arr2[2]&&arr2[2].split("jira_api_token:")[1]
  
  const projectKey = arr2[3]&&arr2[3].split("project_key:")[1]
  
  const summarys = arr2[4]&&arr2[4].split("summary:")[1]
 

  const issueName = arr2[5]&&arr2[5].split("issue_name:")[1]

  
  if(host && emails  && jiraApiToken  && projectKey  && summarys  &&
  issueName){
  


  const finalStr = `${emails}:${jiraApiToken}`;
  const bufferData = Buffer.from(finalStr);
  const token = "Basic " + bufferData.toString("base64");
  

  axios
    .post(
      `${host}/rest/api/2/issue`,
      {
        fields: {
          project: {
            key: projectKey,
          },
          summary: summarys,
          issuetype: {
            name: issueName,
          },
        },
      },

      {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      }
    )
    .then(async (result) => {
      try{
        await web.chat.postMessage({
          text: `Issue created successfully ${host}/browse/${result.data.key}`,
          
          channel: channelID,
        });
      }
      catch(error){
        console.error(error);
      }
    })
    .catch((err) => {
      console.error("err", JSON.stringify(err));
      try{
      web.chat.postMessage({
        text:'error creating issue '+ err.message,
        channel: channelID,
      })
    }
    catch(error){
      console.error(error);
    }
    });

  }
  else{
    try{
    web.chat.postMessage({
      text:'Enter required info example - /jira-bot host:https://firstjiraproject2.atlassian.net,email:stupidminions3@gmail.com,jira_api_token:Ur0QuUK7hbOn3c45yrFN49DE,project_key:JIR,summary:Starting,issue_name:Task',
      channel: channelID,
    })
  }catch(error){
    console.error(error)
  }
  }
}


  else{
    try{
    web.chat.postMessage({
      text:'Enter required info example - /jira-bot host:https://firstjiraproject2.atlassian.net,email:stupidminions3@gmail.com,jira_api_token:Ur0QuUK7hbOn3c45yrFN49DE,project_key:JIR,summary:Starting,issue_name:Task',
      channel: channelID,
    })
  }catch(error){
    console.error(error)
  }
  }
});


app.listen(3000, console.log("server ...."));

