import Content from "./content";

export default function Page({ params }: { params: { slug: string; id: string } }) {
    const { id } = params;

    return (
        <div className="p-8 w-full h-full">
            <Content onboardingId={id} />
        </div>
    );

}