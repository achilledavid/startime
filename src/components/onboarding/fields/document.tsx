import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation } from '@tanstack/react-query';
import { uploadFile } from '@/lib/blob';
import { useActiveOrganization } from '@/lib/auth-client';

interface DocumentFieldProps {
    onUpdate: (file: string) => void;
    defaultValue?: File | null;
}

function DocumentField({ onUpdate, defaultValue }: DocumentFieldProps) {
    const [file, setFile] = useState<File | null>(defaultValue || null);
    const inputRef = useRef<HTMLInputElement>(null);
    const { data: organization, isPending } = useActiveOrganization();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setFile(file);
    };

    const handleButtonClick = () => {
        inputRef.current?.click();
    };

    const defaultFileName = defaultValue ? defaultValue.name : '';

    const blobMutation = useMutation({
        mutationFn: async (file: File) => {
            return await uploadFile(file, organization?.slug || '');
        }
    })

    async function uploadCurrentFile(file: File) {
        const res = await blobMutation.mutateAsync(file);

        onUpdate(res.url);
    }


    useEffect(() => {
        if (isPending || !file || !organization) return;

        uploadCurrentFile(file);
    }, [file]);

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