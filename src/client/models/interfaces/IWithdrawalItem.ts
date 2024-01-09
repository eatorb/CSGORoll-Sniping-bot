export interface IWithdrawalItem {
    id: string;
    marketName: string;
    value: number;
    customValue: boolean;
    itemVariant: ItemVariant;
    markupPercent: number;
    stickers: any[];
    steamExternalAssetId: string;
}