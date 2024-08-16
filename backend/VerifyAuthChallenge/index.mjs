export const handler = async(event) => {
  console.log("Received event:", JSON.stringify(event, null, 2));
  if(event.request.privateChallengeParameters.answer === event.request.challengeAnswer) {
    event.response.answerCorrect = true;
  } else {
    event.response.answerCorrect = false;
  }
  return event;
}