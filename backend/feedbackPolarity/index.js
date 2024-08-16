const { LanguageServiceClient } = require("@google-cloud/language");

const client = new LanguageServiceClient();

exports.analyzeSentiment = async (req, res) => {
  try {
    const { textArray } = req.body;

    if (!Array.isArray(textArray) || textArray.length === 0) {
      return res.status(400).send("Input should be an array of strings.");
    }

    let totalSentiment = 0;

    let count = 0;

    for (const text of textArray) {
      const [result] = await client.analyzeSentiment({
        document: { content: text, type: "PLAIN_TEXT" },
      });
      const sentiment = result.documentSentiment;
      totalSentiment += sentiment.score;
      count++;
    }

    const averageSentiment = count > 0 ? totalSentiment / count : 0;

    const sentimentCategory = getSentimentCategory(averageSentiment);

    res.json({ overallPolarity: sentimentCategory });
  } catch (error) {
    console.error("Error analyzing sentiment:", error);
    res.status(500).send("Internal Server Error");
  }
};

function getSentimentCategory(score) {
  if (score > 0.8) {
    return "Overwhelmingly Positive";
  } else if (score > 0.4) {
    return "Positive";
  } else if (score >= -0.4) {
    return "Neutral";
  } else if (score > -0.8) {
    return "Negative";
  } else {
    return "Overwhelmingly Negative";
  }
}
