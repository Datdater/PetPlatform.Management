export interface IStore {
  id: string;
  name: string;
  hotline: string;
  logoUrl: string;
  bannerUrl: string;
  businessType: string;
  businessAddressProvince: string;
  businessAddressDistrict: string;
  businessAddressWard: string;
  businessAddressStreet: string;
  faxEmail: string;
  faxCode: string;
  frontIdentityCardUrl: string;
  backIdentityCardUrl: string;
}

export interface IStoreAddress {
  id: string;
  addressFullPath: string;
}
