import Content from "./content";

export default async function Page({ params }: { params: Promise<{ slug: string; id: string }> }) {
    const { id } = await params;

    return (
        <div className="p-8 w-full h-full">
            <Content onboardingId={parseInt(id)} />
        </div>
    );

}