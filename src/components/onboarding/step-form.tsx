import { ChangeEvent, useEffect, useState } from 'react';
import { RawStep } from './step-editor';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import VideoField from './fields/video';
import DocumentField from './fields/document';
import ChecklistField from './fields/checklist';

type StepFormProps = {
    step: RawStep;
    onUpdate: (index: number, updatedStep: RawStep) => void;
    index: number;
};

function StepForm({ step, onUpdate, index }: StepFormProps) {
    const [stepData, setStepData] = useState<RawStep>(step);

    function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        setStepData({ ...stepData, [e.target.name]: e.target.value });
        onUpdate(index, { ...stepData, [e.target.name]: e.target.value });
    };

    function handleSelectChange(value: string) {
        setStepData({ ...stepData, type: value as RawStep['type'] });
        onUpdate(index, { ...stepData, type: value as RawStep['type'] });
    };

    function handleSpecificFieldUpdate(value: string) {
        setStepData({ ...stepData, value });
        onUpdate(index, { ...stepData, value });
    };

    function handleSpecificFileFieldUpdate(value: File | null) {
        if (!value) {
            setStepData({ ...stepData, value: '' });
            onUpdate(index, { ...stepData, value: '' });
            return;
        }

        setStepData({ ...stepData, value });
        onUpdate(index, { ...stepData, value });
    };

    function handleChecklistCreation(checklistId: number) {
        setStepData({ ...stepData, checklistId });
        onUpdate(index, { ...stepData, checklistId });
    };

    return (
        <div className='w-full space-y-4'>
            <div className='flex w-full gap-4 items-center '>
                <div className='w-full space-y-2'>
                    <Label>Title</Label>
                    <Input
                        type="text"
                        name="title"
                        value={stepData.title}
                        onChange={handleChange}
                    />
                </div>
                <div className='w-full space-y-2'>
                    <Label>Type</Label>
                    <Select
                        name="type"
                        value={stepData.type}
                        onValueChange={handleSelectChange}
                    >
                        <SelectTrigger className='w-full'>
                            <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="document">Document</SelectItem>
                            <SelectItem value="video">Video</SelectItem>
                            <SelectItem value="checklist">Checklist</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className='w-full space-y-2'>
                <Label>Description</Label>
                <Textarea
                    name="description"
                    value={stepData.description}
                    onChange={handleChange}
                />
            </div>
            {stepData.type === 'video' && (
                <VideoField
                    value={typeof stepData.value === 'string' ? stepData.value : ''}
                    onUpdate={handleSpecificFieldUpdate}
                />
            )}
            {stepData.type === 'document' && (
                <DocumentField defaultValue={stepData.value && typeof stepData.value === 'string' ? new File([], stepData.value) : null} onUpdate={handleSpecificFileFieldUpdate} />
            )}
            {stepData.type === 'checklist' && (
                <ChecklistField onCreate={handleChecklistCreation} checklistId={stepData?.checklistId} />
            )}
            <div className='w-full space-y-2'>
                <Label>Duration (minutes)</Label>
                <Input
                    type="number"
                    name="duration"
                    value={stepData.duration}
                    onChange={handleChange}
                />
            </div>
        </div>
    );
}

export default StepForm;