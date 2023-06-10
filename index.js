const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const readline = require("readline");

async function downloadTikTokVideo(videoUrl, outputFileName) {
  try {
    const response = await axios.get(videoUrl);
    const $ = cheerio.load(response.data);
    const videoSrc = $("video source").attr("src");
    const videoDownloadUrl = `https:${videoSrc}`;

    const videoResponse = await axios.get(videoDownloadUrl, { responseType: "stream" });
    const videoStream = videoResponse.data;
    const videoFile = fs.createWriteStream(outputFileName);

    videoStream.pipe(videoFile);

    videoFile.on("finish", () => {
      console.log("Video berhasil diunduh.");
    });

    videoFile.on("error", (error) => {
      console.error("Terjadi kesalahan saat mengunduh video:", error);
    });
  } catch (error) {
    console.error("Terjadi kesalahan:", error);
  }
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Masukkan URL video TikTok: ", (videoUrl) => {
  rl.question("Masukkan nama file output: ", (outputFileName) => {
    downloadTikTokVideo(videoUrl, outputFileName);
    rl.close();
  });
});
