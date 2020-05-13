const SLACK = require('../services/slack')
export const getBugReport = (req, res) => {
  const USER = req.body.user_name;
  const TEXT = req.body.text;
  const APP = TEXT.split(' ')[0];
  const MSG = TEXT.substr(TEXT.indexOf(" ") + 1);

  console.log(`${USER} Reporting ${APP} for ${MSG}`);
  let slackMsg = `<@${process.env.Admin1}> <@${process.env.Admin2}> \n`
  slackMsg += `${USER} has reported ${APP} Reason: ${MSG}`
  SLACK.sendMessage(process.env.BETA_CHANNEL, slackMsg, null, () => {
    res.status(200).send("Message Successfully Reported");
  } )

}
