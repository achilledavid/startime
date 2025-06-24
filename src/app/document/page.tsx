import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { TabsList } from "@radix-ui/react-tabs";
import { Tabs, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import styles from './document.module.css';

import { Download, Eye, Clock } from 'lucide-react';
import { FileText, Gavel, Heart, Shield, Users, Building   } from 'lucide-react';



export default function CardDemo() {
    return (
        <Tabs defaultValue="documents">
            <TabsList className="flex bg-gray-100 p-1">
                <TabsTrigger value="documents"><FileText color="black"/>Tous les documents</TabsTrigger>
                <TabsTrigger value="juridique"><Gavel />Juridique</TabsTrigger>
                <TabsTrigger value="securite"><Shield />Sécurité</TabsTrigger>
                <TabsTrigger value="ressources_humaines"><Users />Ressources Humaines</TabsTrigger>
                <TabsTrigger value="Entreprise"><Building />Entreprise</TabsTrigger>
                <TabsTrigger value="Avantages"><Heart />Avantages</TabsTrigger>
            </TabsList>
            <TabsContent value="documents">
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
            </TabsContent>
        </Tabs>
    )
}
