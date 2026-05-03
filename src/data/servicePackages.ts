export type BillingPeriod = "monthly" | "yearly";

export type ServicePackage = {
    id: "starter" | "pro" | "enterprise";
    name: string;
    description: string;
    monthlyPrice: number | null;
    features: string[];
    cta: string;
    popular: boolean;
    checkoutEnabled: boolean;
};

export const billingPeriods: Record<
    BillingPeriod,
    {
        id: BillingPeriod;
        label: string;
        shortLabel: string;
        priceMultiplier: number;
        periodLabel: string;
        badge?: string;
    }
> = {
    monthly: {
        id: "monthly",
        label: "Bulanan",
        shortLabel: "bulan",
        priceMultiplier: 1,
        periodLabel: "/bulan",
    },
    yearly: {
        id: "yearly",
        label: "Tahunan",
        shortLabel: "tahun",
        priceMultiplier: 10,
        periodLabel: "/tahun",
        badge: "Hemat 2 bulan + domain gratis",
    },
};

export const servicePackages: ServicePackage[] = [
    {
        id: "starter",
        name: "Starter",
        monthlyPrice: 150_000,
        description: "Cocok untuk media baru dan media daerah.",
        features: [
            "Penerbitan artikel tidak terbatas",
            "Optimasi SEO",
            "Manajemen user hingga 3 akun",
            "1 tema premium",
        ],
        cta: "Mulai Starter",
        popular: false,
        checkoutEnabled: true,
    },
    {
        id: "pro",
        name: "Pro",
        monthlyPrice: 300_000,
        description: "Dirancang untuk media yang sudah berjalan dengan trafik tinggi.",
        features: [
            "Penerbitan artikel tidak terbatas",
            "Optimasi SEO dan analitik",
            "Manajemen user hingga 10 akun",
            "Akses ke semua tema premium",
            "Prioritas dukungan teknis",
            "Komunikasi langsung dengan tim developer untuk penyesuaian fitur dan troubleshooting",
        ],
        cta: "Mulai Pro",
        popular: true,
        checkoutEnabled: true,
    },
    {
        id: "enterprise",
        name: "Enterprise",
        monthlyPrice: null,
        description: "Untuk kebutuhan migrasi besar, integrasi sistem, dan infrastruktur khusus.",
        features: [
            "SLA uptime 99.9%",
            "Integrasi API eksternal",
            "Migrasi data CMS lama",
            "Account manager khusus",
        ],
        cta: "Diskusikan Kebutuhan",
        popular: false,
        checkoutEnabled: false,
    },
];

export function getServicePackage(packageId: string | undefined) {
    return servicePackages.find((servicePackage) => servicePackage.id === packageId);
}

export function normalizeBillingPeriod(period: string | null | undefined): BillingPeriod {
    return period === "yearly" ? "yearly" : "monthly";
}

export function getPackagePrice(servicePackage: ServicePackage, period: BillingPeriod) {
    if (servicePackage.monthlyPrice === null) return null;

    return servicePackage.monthlyPrice * billingPeriods[period].priceMultiplier;
}

export function formatIdr(amount: number) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(amount);
}

export function formatCompactIdr(amount: number) {
    if (amount >= 1_000_000) {
        const value = amount / 1_000_000;
        return `${Number.isInteger(value) ? value : value.toLocaleString("id-ID")}JT`;
    }

    if (amount >= 1_000) {
        return `${amount / 1_000}K`;
    }

    return String(amount);
}
