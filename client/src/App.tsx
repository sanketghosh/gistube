import { useEffect, useState } from "react";
import Navbar from "./components/navbar";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import axios from "axios";
import { Skeleton } from "./components/ui/skeleton";

interface TranscriptEntry {
  text: string;
  duration: number;
  offset: number;
}

export default function App() {
  const [videoId, setVideoId] = useState<string>("");
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showFullTranscript, setShowFullTranscript] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (videoId) {
      fetchTranscript();
    }
  }, [videoId]);

  const fetchTranscript = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:3000/transcript?videoId=${videoId}`
      );
      const transcriptData: TranscriptEntry[] = response.data.transcript;
      setTranscript((prevTranscript) => [...prevTranscript, ...transcriptData]);
      setError(null);
    } catch (error: any) {
      // setTranscript([]);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (transcript: string) => {
    navigator.clipboard
      .writeText(transcript)
      .then(() => setIsCopied(true))
      .catch((err) => console.error("Error copying to clipboard:", err));

    // Reset the "Copied" state after a short delay
    setTimeout(() => setIsCopied(false), 1500);
  };

  return (
    <>
      <main className="">
        <div className="max-w-4xl mx-auto">
          <Navbar />

          <div className="pt-1 md:pt-7 pb-2 md:pb-4 px-3 md:px-5 lg:px-7 space-y-3 flex flex-col items-center justify-center">
            <h1 className="text-center lg:text-5xl mt-5 text-xl font-extrabold leading-[1.15]  md:text-4xl">
              Sculpt Your YouTube Adventure.{"  "}{" "}
              <br className="max-md:hidden" />
              Precision Summaries{" "}
              <span className="orange_gradient">at Your Fingertips!</span>{" "}
            </h1>
            <p className="mt-5 text-xs sm:text-sm md:text-base max-w-4xl text-center">
              Elevate your YouTube journey with our Smart Summerizer app. Trim
              the noise, savor the essence! Condense videos, save time, and dive
              into the highlights.
            </p>
          </div>

          <div className="py-4 px-3 md:px-5 lg:px-7">
            <div className="flex items-center flex-col md:flex-row gap-3">
              <Input
                className=""
                placeholder="Enter your video link"
                onChange={(e) => setVideoId(e.target.value)}
                value={videoId}
              />
              <Button className="w-full md:w-auto" onClick={fetchTranscript}>
                {loading ? "Generating Transcript" : "Generate Transcript"}
              </Button>
            </div>
          </div>

          <div className="py-4 px-3 md:px-5 lg:px-7">
            {videoId.length < 1 && (
              <p className="font-semibold text-red-500">Please enter an id</p>
            )}
            {error && (
              <p className="font-semibold text-red-500">
                ERROR: Something is wrong!
              </p>
            )}
            {loading ? (
              <Skeleton className="w-full h-48 rounded-md" />
            ) : (
              <>
                {transcript.length > 0 && (
                  <div className="border p-3 rounded-md">
                    <p className="text-[13px] md:text-sm">
                      {showFullTranscript
                        ? transcript.map((entry) => entry.text).join(" ")
                        : transcript
                            .slice(0, 6)
                            .map((entry) => entry.text)
                            .join(" ")}
                    </p>
                    <div className="flex items-center gap-3 justify-start">
                      {!showFullTranscript && transcript.length > 3 ? (
                        <Button
                          onClick={() => setShowFullTranscript(true)}
                          variant={"link"}
                          className="p-0"
                        >
                          See More
                        </Button>
                      ) : (
                        <Button
                          onClick={() => setShowFullTranscript(false)}
                          variant={"link"}
                          className="p-0"
                        >
                          See Less
                        </Button>
                      )}
                      <Button
                        variant={"link"}
                        className="p-0"
                        onClick={() => {
                          copyToClipboard(
                            transcript.map((entry) => entry.text).join(" ")
                          );
                        }}
                      >
                        {isCopied ? "Copied" : "Copy Text"}
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
