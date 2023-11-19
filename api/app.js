import express from "express";
import { YoutubeTranscript } from "youtube-transcript";
import cors from "cors";

const app = express();
const port = 3000;

// Use cors middleware
app.use(cors());

app.get("/transcript", async (req, res) => {
  const videoId = req.query.videoId;

  if (!videoId) {
    return res.status(400).json({ error: "Missing videoId parameter" });
  }

  try {
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);
    res.json({ transcript });
    console.log(transcript);
  } catch (error) {
    console.error("Error fetching transcript:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
