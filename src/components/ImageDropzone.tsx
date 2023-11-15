"use client";
import { useDropzone } from "react-dropzone";
import { CSSProperties } from "react";

const baseStyle: CSSProperties = {
    padding: 30,
    borderWidth: 2,
    borderRadius: 6,
    borderColor: "#eeeeee",
    borderStyle: "dashed",
    backgroundColor: "#fff",
    color: "#bdbdbd",
    outline: "none",
    transition: "border .2s ease-in-out",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    cursor: "pointer",
};

const focusedStyle = {
    borderColor: "#2196f3",
};

const acceptStyle = {
    borderColor: "#00e676",
};

const rejectStyle = {
    borderColor: "#ff1744",
};

type Props = {
    onDrop: (files: File[]) => void;
}

const ImageDropzone = ({ onDrop }: Props) => {
    const { getRootProps, getInputProps, isDragActive, isFocused, isDragAccept, isDragReject } = useDropzone({
        onDrop,
        accept: { "video/*": [".mp4", ".ogv", ".mpeg"] },
    });

    const style = {
        ...baseStyle,
        ...(isFocused ? focusedStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
        ...(isDragReject ? rejectStyle : {}),
    };

    return (
        <div {...getRootProps({ style })}>
            <input {...getInputProps()} />
            {isDragActive ? (
                <p>Drop the video here ...</p>
            ) : (
                <p>Drag and drop video here, or click to select files</p>
            )}
        </div>
    );
};

export default ImageDropzone;