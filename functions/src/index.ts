import {onObjectFinalized} from "firebase-functions/v2/storage";
import {getStorage} from "firebase-admin/storage";
import * as logger from "firebase-functions/logger";
import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "@ffmpeg-installer/ffmpeg";
import OpenAI from "openai";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import serviceAccount from "./serviceAccount.json";
import * as admin from "firebase-admin";

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    databaseURL: "https://speech-transcriber-81b11-default-rtdb.firebaseio.com",
});
const db = admin.database();

ffmpeg.setFfmpegPath(ffmpegPath.path);
const videoBucket = getStorage().bucket("speech-transcriber-81b11.appspot.com");
const audioBucket = getStorage().bucket("audio-files-432e");

export const onVideoFileUploaded = onObjectFinalized(
    {bucket: "speech-transcriber-81b11.appspot.com"},
    async (event) => {
        const file = event.data;
        const metadata = file.metadata as { uploadId: string };
        const rs = videoBucket.file(file.name).createReadStream();
        const audioFileName = file.name.replace(/\.[^/.]+$/, ".mp3");
        const ws = audioBucket.file(audioFileName).createWriteStream({
            metadata: {
                metadata: {
                    uploadId: metadata.uploadId,
                },
                contentType: "audio/mpeg",
            },
        });

        await new Promise((resolve, reject) => {
            ffmpeg()
                .input(rs)
                .toFormat("mp3")
                .on("error", (err) => {
                    logger.error(err.message);
                    reject(err);
                })
                .on("end", () => {
                    logger.log(`File ${file.name} converted.`);
                    videoBucket.file(file.name).delete();
                    resolve(null);
                })
                .pipe(ws, {end: true});
        });
    });

export const onAudioFileUploaded = onObjectFinalized({bucket: "audio-files-432e"}, async (event) => {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });
    const file = event.data;
    const metadata = file.metadata as { uploadId: string; };
    const tmpFilePath = path.join(os.tmpdir(), file.name);
    await audioBucket.file(file.name).download({destination: tmpFilePath});
    
    const transcription = await openai.audio.transcriptions.create({
        file: fs.createReadStream(tmpFilePath),
        model: "whisper-1",
        language: "en",
    });

    const transcriptRef = db.ref("transcripts");
    transcriptRef.set({
        [metadata.uploadId]: {
            transcript: transcription.text,
        },
    }).catch((err) => {
        logger.error(err.message);
    });
    fs.unlinkSync(tmpFilePath);
});
