import { ChangeEvent, useState } from 'react';
import { RawStep } from './step-editor';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import VideoField from './fields/video';
import DocumentField from './fields/document';
import ChecklistField from './fields/checklist';
import { CheckSquare, FileText, Video } from 'lucide-react';

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

    function handleSpecificFileFieldUpdate(value: string) {
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

    function handleDurationChange(e: ChangeEvent<HTMLInputElement>) {
        const value = parseInt(e.target.value, 10);
        if (isNaN(value) || value < 0) {
            setStepData({ ...stepData, duration: 0 });
            onUpdate(index, { ...stepData, duration: 0 });
        } else {
            setStepData({ ...stepData, duration: value });
            onUpdate(index, { ...stepData, duration: value });
        }
    };

    return (
        <div className='space-y-4'>
            <div className='flex gap-4'>
                <div className='w-full'>
                    <Label className='mb-2'>Title</Label>
                    <Input
                        type="text"
                        name="title"
                        value={stepData.title}
                        onChange={handleChange}
                    />
                </div>
                <div className='w-full'>
                    <Label className='mb-2'>Type</Label>
                    <Select
                        name="type"
                        value={stepData.type}
                        onValueChange={handleSelectChange}
                    >
                        <SelectTrigger className='w-full'>
                            <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="document">
                                <div className="flex items-center gap-2">
                                    <FileText className="w-4 h-4" />
                                    Document
                                </div>
                            </SelectItem>
                            <SelectItem value="video">
                                <div className="flex items-center gap-2">
                                    <Video className="w-4 h-4" />
                                    Video
                                </div>
                            </SelectItem>
                            <SelectItem value="checklist">
                                <div className="flex items-center gap-2">
                                    <CheckSquare className="w-4 h-4" />
                                    Checklist
                                </div>
                            </SelectItem>
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
            {(() => {
                switch (stepData.type) {
                    case 'video':
                        return (
                            <VideoField
                                value={typeof stepData.value === 'string' ? stepData.value : ''}
                                onUpdate={handleSpecificFieldUpdate}
                            />
                        );
                    case 'document':
                        return (
                            <DocumentField
                                defaultValue={stepData.value && typeof stepData.value === 'string' ? new File([], stepData.value) : null}
                                onUpdate={handleSpecificFileFieldUpdate}
                            />
                        );
                    case 'checklist':
                        return (
                            <ChecklistField
                                onCreate={handleChecklistCreation}
                                checklistId={stepData?.checklistId}
                            />
                        );
                    default:
                        return null;
                }
            })()}
            <div className='w-full space-y-2'>
                <Label>Duration (minutes)</Label>
                <Input
                    type="number"
                    name="duration"
                    value={stepData.duration}
                    onChange={handleDurationChange}
                />
            </div>
        </div>
    );
}

export default StepForm;
