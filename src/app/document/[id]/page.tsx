import DocumentClient from './DocumentClient';

export function generateStaticParams() {
  return [
    { id: 'perm_001' },
    { id: 'perm_002' }
  ];
}

export default function SignedDocumentPage({ params }: { params: { id: string } }) {
  return <DocumentClient id={params.id} />;
}
