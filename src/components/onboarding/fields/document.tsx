import { ChangeEvent, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DocumentFieldProps {
    onUpdate: (file: File | null) => void;
    defaultValue?: File | null;
}

function DocumentField({ onUpdate, defaultValue }: DocumentFieldProps) {
    const [file, setFile] = useState<File | null>(defaultValue || null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setFile(file);
        onUpdate(file);
    };

    const handleButtonClick = () => {
        inputRef.current?.click();
    };

    const defaultFileName = defaultValue ? defaultValue.name : '';

    return (
        <div className="space-y-2">
            <Label htmlFor="document-upload">Upload document</Label>
            <Input
                id="document-upload"
                type="file"
                ref={inputRef}
                onChange={handleChange}
                className="hidden"
            />
            <Button type="button" variant="outline" onClick={handleButtonClick}>
                Choose File
            </Button>

            {defaultFileName && (
                <div className="text-sm text-muted-foreground">
                    Current file: {defaultFileName}
                </div>
            )}

            {file && (
                <div className="text-sm text-muted-foreground mt-2">
                    Selected file: {file.name}
                </div>
            )}
        </div>
    );
}

export default DocumentField;