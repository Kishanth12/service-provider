import { Provider } from "@/types";

interface ProviderStatsProps {
  providers: Provider[];
}

export function ProviderStats({ providers }: ProviderStatsProps) {
  const totalServices = providers.reduce(
    (sum, p) => sum + (p.providerServices?.length || 0),
    0
  );

  const avgServices =
    providers.length > 0 ? Math.round(totalServices / providers.length) : 0;

  const stats = [
    {
      label: "Total Providers",
      value: providers.length,
      color: "bg-blue-500",
    },
    {
      label: "Active Services",
      value: totalServices,
      color: "bg-green-500",
    },
    {
      label: "Avg Services/Provider",
      value: avgServices,
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white rounded-lg border border-slate-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">{stat.label}</p>
              <p className="text-3xl font-bold mt-2">{stat.value}</p>
            </div>
            <div className={`w-12 h-12 rounded-lg ${stat.color} opacity-10`} />
          </div>
        </div>
      ))}
    </div>
  );
}
