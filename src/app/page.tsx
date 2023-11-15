"use client";
import ImageDropzone from "@/components/ImageDropzone";
import Transcript from "@/components/Transcript";
import { useCallback, useState } from "react";
import path from "path";
import { storage } from "@/lib/firebase";
import { ref, uploadBytes } from "firebase/storage";
import { v4 as uuid } from "uuid";
import Spinner from "@/components/Spinner";

export default function Home() {
    const [id, setId] = useState<string>();
    const [loading, setLoading] = useState<boolean>(false);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            setLoading(true);
            const file = acceptedFiles[0];
            const fileName = file.name.replace(/\.[^/.]+$/, "");
            const fileRef = ref(storage, `${fileName}-${Date.now()}${path.extname(file.name)}`);
            const uploadId = uuid();
            await uploadBytes(fileRef, file, {
                customMetadata: {
                    uploadId
                }
            });
            setId(uploadId);
        }
    }, []);

    return (
        <>
            {loading ? <Spinner /> : <ImageDropzone onDrop={onDrop} />}
            <Transcript id={id} setLoading={setLoading} />
        </>
    );
}
