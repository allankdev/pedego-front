import Link from "next/link";

interface StoreCardProps {
  id: string;
  name: string;
  address: string;
}

export const StoreCard = ({ id, name, address }: StoreCardProps) => {
  return (
    <Link href={`/store/${id}`}>
      <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
        <h3 className="text-lg font-bold">{name}</h3>
        <p className="text-sm text-gray-600">{address}</p>
      </div>
    </Link>
  );
};