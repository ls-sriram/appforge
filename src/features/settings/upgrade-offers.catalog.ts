export interface UpgradeOfferModel {
  id: string;
  title: string;
  priceLabel: string;
  description: string;
}

export const mockUpgradeOffers: UpgradeOfferModel[] = [
  {
    id: "pro-monthly",
    title: "Upgrade to Pro",
    priceLabel: "$19 / month",
    description: "Full Pro access for individual users.",
  },
  {
    id: "team-pro",
    title: "Upgrade to Team Pro",
    priceLabel: "$49 / month",
    description: "Shared access for small teams.",
  },
];

