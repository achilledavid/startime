import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import styles from './document.module.css';

import { Download, Eye, Clock } from 'lucide-react';

export default function CardDemo() {
    return (
        <div className={styles.container}>
            {Object.keys(Array(10).fill(0)).map((_, index) => (
            <Card key={index} className="w-full">
            <CardHeader>
                <CardTitle>Title</CardTitle>
                <CardDescription>Description</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-row gap-4">
                <p>Taille fichier</p>
                <Clock />
                <p>Date</p>
            </CardContent>
            <CardFooter className="flex-row gap-2">
                <Button variant="outline" className="w-5/6">
                    <Eye /> Consulter
                </Button>
                <Button variant="outline" className="w-1/6">
                <Download color="black" size={48} />
                </Button>
            </CardFooter>
            </Card>
            ))}
        </div>
    )
}
