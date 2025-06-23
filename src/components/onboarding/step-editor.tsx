import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

export default function StepEditor({ initalSteps = [] }) {
    const [steps, setSteps] = useState<typeof initalSteps>(initalSteps);

    return (
        <div className="w-full flex gap-8">
            <Card className="w-1/3 h-full">
                <CardHeader>
                    <CardTitle>Steps</CardTitle>
                </CardHeader>
                <CardContent>
                    {steps.map((step, index) => (
                        <div key={index} className="mb-4">
                            <Input placeholder="Step title" value={step.title} />
                            <Textarea placeholder="Step description" value={step.description} />
                        </div>
                    ))}
                </CardContent>
            </Card>
            <Card className="w-2/3 h-full">
                <CardHeader>
                    <CardTitle>Step editing</CardTitle>
                </CardHeader>
                <CardContent>
                    <Input placeholder="Step title" />
                    <Textarea placeholder="Step description" />
                </CardContent>
            </Card>
        </div>
    );
}