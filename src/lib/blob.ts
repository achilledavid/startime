import axios from 'axios';

export async function uploadFile(file: File, slug: string) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('slug', slug)

    const response = await axios.post(`/api/blob`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return response.data as {
        url: string
        pathname: string,
    };
}

export function formatFileSize(size: number) {
    if (size >= 1024 * 1024) {
        return (size / (1024 * 1024)).toFixed(2) + " MB";
    } else {
        return (size / 1024).toFixed(2) + " kB";
    }
}