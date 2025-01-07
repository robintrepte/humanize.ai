import SavedHumanizationContent from "./SavedHumanizationContent";

interface HumanizationDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function HumanizationDetailPage({
  params,
}: HumanizationDetailPageProps) {
  const resolvedParams = await params;
  return <SavedHumanizationContent id={resolvedParams.id} />;
} 