"use client";
import { db } from "@/lib/firebase";
import { onValue } from "firebase/database";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ref } from "firebase/database";
import { TypeAnimation } from "react-type-animation";

type Props = {
    id?: string;
    setLoading: Dispatch<SetStateAction<boolean>>;
}

const Transcript = ({ id, setLoading }: Props) => {
    const [transcript, setTranscript] = useState<string>();
    useEffect(() => {
        onValue(ref(db, "transcripts/" + id), (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val() as { transcript: string };
                setTranscript(data.transcript);
                setLoading(false);
            }
        });
    }, [id, setLoading]);

    return (
        <p className="mt-10 place-self-start">
            {transcript && 
                <TypeAnimation
                    sequence={[transcript]}
                    wrapper="span"
                    cursor={false}
                    speed={75}
                    repeat={0}
                />
            }
        </p>
    );
};

export default Transcript;