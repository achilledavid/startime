import { ChangeEvent } from 'react';
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
    const defaultFileName = defaultValue ? defaultValue.name : '';

    const { data: organization } = useActiveOrganization();

    const blobMutation = useMutation({
        mutationFn: async (file: File) => {
            return await uploadFile(file, organization?.slug || '');
        }
    })

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0 || !organization) return
        blobMutation.mutate(e.target.files[0], {
            onSuccess: (res) => {
                onUpdate(res.url);
            }
        })
    };

    const parseFileNameFromUrl = (url: string): string => {
        try {
            const decodedUrl = decodeURIComponent(url);
            const pathParts = decodedUrl.split('/');
            const fileName = pathParts[pathParts.length - 1];
            return fileName;
        } catch (error) {
            console.error('Error parsing filename from URL:', error);
            return url;
        }
    };

    return (
        <div className="space-y-2">
            <Label htmlFor="document-upload">Upload document</Label>
            <Input
                id="document-upload"
                type="file"
                onChange={handleChange}
                disabled={blobMutation.isPending}
            />
            {blobMutation.isPending && (
                <div className="text-sm text-muted-foreground">
                    Uploading file...
                </div>
            )}
            {defaultFileName && !blobMutation.isPending && (
                <div className="text-sm text-muted-foreground">
                    Current file: {parseFileNameFromUrl(defaultFileName)}
                </div>
            )}
        </div>
    );
}

export default DocumentField;
