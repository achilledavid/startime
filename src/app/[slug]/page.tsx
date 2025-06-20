import OrganizationContent from "./content"

export default async function Organization({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params

    return (
        <div className="p-4 space-y-4">
            <OrganizationContent slug={slug} />
        </div>
    )
}