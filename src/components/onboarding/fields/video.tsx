import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";

interface VideoFieldProps {
    value?: string;
    onUpdate: (url: string) => void;
}

export function VideoField({
    value,
    onUpdate
}: VideoFieldProps) {
    const [url, setUrl] = useState(value ?? "");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newUrl = e.target.value;
        setUrl(newUrl);
        onUpdate(newUrl);
    };

    return (
        <div>
            <Label className="mb-2">Video URL</Label>
            <Input
                type="url"
                value={url}
                onChange={handleChange}
                placeholder="Enter video URL"
                style={{ width: "100%" }}
            />
        </div>
    );
};

export default VideoField;