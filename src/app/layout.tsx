import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const poppins = Poppins({
    weight: ["400", "700"],
    style: "normal",
    subsets: ["latin"],
});


export const metadata: Metadata = {
    title: "Speech Transcriber",
    description: "Upload an audio file and get a transcript of the speech."
};

export default function RootLayout({
    children,
}: {
  children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={poppins.className}>
                <div className="flex flex-col max-w-[90%] mx-auto items-center justify-center py-7">
                    <h1 className="font-bold text-4xl mb-3">
                        <Link href="/">Speech Transcriber</Link>
                    </h1>
                    <p className="mb-10">
              Upload an audio file and get a transcript of the speech.
                    </p>
                    {children}
                </div>
            </body>
        </html>
    );
}
